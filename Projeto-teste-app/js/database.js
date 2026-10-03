import { get, push, ref, remove, set, update, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { db } from "./firebase-init.js";

function recipesRef(uid) { return ref(db, `users/${uid}/recipes`); }

export async function listRecipes(uid) {
  const snap = await get(recipesRef(uid));
  if (!snap.exists()) return [];
  const data = snap.val() || {};
  return Object.entries(data).map(([id, recipe]) => ({ id, ...recipe }));
}

export async function getRecipe(uid, id) {
  const snap = await get(ref(db, `users/${uid}/recipes/${id}`));
  return snap.exists() ? { id, ...snap.val() } : null;
}

export async function createRecipe(uid, recipe) {
  const newRef = push(recipesRef(uid));
  await set(newRef, { ...recipe, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return newRef.key;
}

export async function updateRecipe(uid, id, recipe) {
  await update(ref(db, `users/${uid}/recipes/${id}`), { ...recipe, updatedAt: serverTimestamp() });
}

export async function deleteRecipe(uid, id) { await remove(ref(db, `users/${uid}/recipes/${id}`)); }

export async function updateProfile(uid, profile) { await update(ref(db, `users/${uid}/profile`), profile); }

export async function setRecipeFavorite(uid, id, favorite) {
  await update(ref(db, `users/${uid}/recipes/${id}`), { favorite: !!favorite, updatedAt: serverTimestamp() });
}

export async function getShoppingList(uid) {
  const snap = await get(ref(db, `users/${uid}/shoppingList`));
  if (!snap.exists()) return [];
  const data = snap.val() || {};
  return Object.entries(data).map(([id, item]) => ({ id, ...item }));
}

export async function saveShoppingList(uid, items) {
  const payload = {};
  items.forEach(item => {
    if (item?.name?.trim()) payload[item.id || push(ref(db, `users/${uid}/shoppingList`)).key] = {
      name: item.name.trim(), qty: item.qty || "", unit: item.unit || "", checked: !!item.checked, createdAt: item.createdAt || Date.now()
    };
  });
  await set(ref(db, `users/${uid}/shoppingList`), payload);
}
