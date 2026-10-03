import { deleteObject, getDownloadURL, ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";
import { storage } from "./firebase-init.js";

const MAX_ORIGINAL_BYTES = 15 * 1024 * 1024;
const MAX_STORAGE_BYTES = 5 * 1024 * 1024;
const STORAGE_TIMEOUT_MS = 20000;

function withTimeout(promise, ms) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(Object.assign(new Error("O envio ao Firebase Storage excedeu o tempo limite."), { code: "storage/retry-limit-exceeded" })), ms);
    })
  ]).finally(() => clearTimeout(timer));
}

function looksLikeImage(file) {
  if (!file) return false;
  if (typeof file.type === "string" && file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif|bmp|heic|heif|avif)$/i.test(file.name || "");
}

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("O navegador não conseguiu decodificar essa foto. Será tentado o envio direto ao Firebase."));
    };
    image.src = objectUrl;
  });
}

async function getDrawable(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch (_) {}
  }
  return loadImageElement(file);
}

export async function prepareImage(file, maxSize = 1500, quality = 0.84) {
  if (!file) return null;
  if (!looksLikeImage(file)) throw new Error("Selecione uma foto válida.");
  if (file.size && file.size > MAX_ORIGINAL_BYTES) {
    throw new Error("A foto selecionada é muito grande. Escolha uma imagem de até 15 MB.");
  }

  const drawable = await getDrawable(file);
  const sourceWidth = drawable.width || drawable.naturalWidth;
  const sourceHeight = drawable.height || drawable.naturalHeight;
  if (!sourceWidth || !sourceHeight) throw new Error("Não foi possível identificar o tamanho da foto.");

  const scale = Math.min(1, maxSize / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Seu navegador não conseguiu preparar a foto.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(drawable, 0, 0, width, height);
  if (typeof drawable.close === "function") drawable.close();

  // Reduz progressivamente a qualidade caso uma foto muito detalhada ultrapasse o limite do Storage.
  let blob = null;
  for (const q of [quality, 0.72, 0.60, 0.50]) {
    blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", q));
    if (blob && blob.size <= MAX_STORAGE_BYTES) break;
  }
  if (!blob) throw new Error("Não foi possível preparar a imagem para o Firebase.");
  if (blob.size > MAX_STORAGE_BYTES) throw new Error("A imagem continua muito grande depois da otimização. Escolha outra foto.");
  return blob;
}

export async function blobToDataUrl(blob) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Não foi possível preparar uma cópia da foto para salvar."));
    reader.readAsDataURL(blob);
  });
}

export async function uploadRecipeImage(uid, recipeId, file) {
  if (!uid || !recipeId) throw new Error("Não foi possível identificar o usuário ou a receita.");
  if (!file) return {};
  if (!looksLikeImage(file)) throw new Error("Selecione uma foto válida.");
  if (file.size > MAX_ORIGINAL_BYTES) throw new Error("A foto selecionada é muito grande. Escolha uma imagem de até 15 MB.");

  let blob = null;
  let optimizationError = null;
  try {
    blob = await prepareImage(file);
  } catch (error) {
    optimizationError = error;
  }

  // Caminho principal: Firebase Storage.
  if (storage && blob) {
    const path = `recipeImages/${uid}/${recipeId}/cover.jpg`;
    const objectRef = storageRef(storage, path);
    try {
      // Não deixe o botão "Salvando…" preso indefinidamente se o bucket/rede não responder.
      const imageUrl = await withTimeout((async () => {
        await uploadBytes(objectRef, blob, {
          contentType: "image/jpeg",
          cacheControl: "public,max-age=31536000,immutable"
        });
        return await getDownloadURL(objectRef);
      })(), STORAGE_TIMEOUT_MS);
      return { imageUrl, imagePath: path, imageStorageFallback: false };
    } catch (error) {
      console.warn("Firebase Storage falhou ou demorou demais; usando imagem compacta no Realtime Database.", error);
    }
  }

  // Fallback robusto: se o Storage ainda não estiver ativado, as regras não tiverem sido publicadas,
  // ou o navegador não conseguir decodificar a foto original, salvamos uma versão compacta como
  // data URL no Realtime Database. Assim a receita não fica perdida e continua funcionando no app.
  try {
    // O fallback precisa ser bem pequeno: Data URL cresce ~33% e vai para o Realtime Database.
    // Reduzimos dimensões e qualidade para que o registro não fique enorme nem demore indefinidamente.
    blob = await prepareImage(file, 700, 0.50);
    if (!blob || blob.size > 900 * 1024) throw new Error("Não foi possível compactar a foto o suficiente. Tente uma imagem menor.");
    const imageDataUrl = await blobToDataUrl(blob);
    return { imageUrl: imageDataUrl, imagePath: "", imageStorageFallback: true };
  } catch (fallbackError) {
    const message = optimizationError?.message || fallbackError?.message;
    throw new Error(`Não foi possível salvar a foto. ${message || "Verifique o Firebase Storage e tente novamente."}`);
  }
}

export async function deleteRecipeImage(imagePath) {
  if (!storage || !imagePath) return;
  try {
    await deleteObject(storageRef(storage, imagePath));
  } catch (error) {
    if (error?.code !== "storage/object-not-found") throw error;
  }
}
