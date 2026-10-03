import { createRecipe, deleteRecipe, getRecipe, listRecipes, updateRecipe } from "./database.js";
import { deleteRecipeImage, uploadRecipeImage } from "./storage.js";

export async function loadUserRecipes(uid) {
  const recipes = await listRecipes(uid);
  return recipes.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
}

export async function saveRecipe({ uid, id, data, imageFile, existingImagePath }) {
  // Primeiro criamos apenas o ID localmente. Assim a foto pode ser enviada antes da gravação final,
  // evitando receitas órfãs quando o upload da imagem falha.
  let recipeId = id;
  let createdHere = false;
  if (!recipeId) {
    const { push, ref } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js");
    const { db } = await import("./firebase-init.js");
    recipeId = push(ref(db, `users/${uid}/recipes`)).key;
    createdHere = true;
  }

  let image = {};
  if (imageFile) image = await uploadRecipeImage(uid, recipeId, imageFile);

  const finalData = {
    ...data,
    ...(image.imageUrl ? image : {}),
    ...(id && !imageFile && existingImagePath ? { imagePath: existingImagePath } : {})
  };

  await updateRecipe(uid, recipeId, finalData);

  if (imageFile && existingImagePath && existingImagePath !== image.imagePath) {
    await deleteRecipeImage(existingImagePath);
  }

  return recipeId;
}

export async function removeRecipe({ uid, recipe }) {
  await deleteRecipe(uid, recipe.id);
  if (recipe.imagePath) await deleteRecipeImage(recipe.imagePath);
}

export { getRecipe };
