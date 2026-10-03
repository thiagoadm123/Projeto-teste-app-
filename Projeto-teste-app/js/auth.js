import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { ref, set, get, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { auth, db, isConfigured } from "./firebase-init.js";

const authState = { user: null, profile: null };

export function watchAuth(callback) {
  if (!isConfigured) {
    callback(null, null, { configured: false });
    return () => {};
  }
  return onAuthStateChanged(auth, async (user) => {
    authState.user = user;
    if (!user) {
      authState.profile = null;
      callback(null, null, { configured: true });
      return;
    }

    try {
      const snap = await get(ref(db, `users/${user.uid}/profile`));
      const profile = snap.exists() ? snap.val() : {};
      authState.profile = profile;
      callback(user, profile, { configured: true, databaseReady: true });
    } catch (error) {
      console.error("Erro ao carregar perfil do Firebase:", error);
      // Mantém a sessão autenticada e deixa a interface mostrar o erro real.
      authState.profile = {};
      callback(user, {}, { configured: true, databaseReady: false, error });
    }
  });
}

export async function registerUser({ displayName, email, password }) {
  if (!isConfigured) throw new Error("CONFIGURE_FIREBASE");

  const credential = await createUserWithEmailAndPassword(auth, email, password);

  try {
    await updateProfile(credential.user, { displayName });
    await set(ref(db, `users/${credential.user.uid}/profile`), {
      displayName,
      email: credential.user.email,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    // Evita deixar uma conta de Authentication órfã quando a gravação do perfil
    // falha, por exemplo, porque as Security Rules do Realtime Database ainda
    // não foram publicadas.
    console.error("Falha ao criar perfil no Realtime Database:", error);
    try { await deleteUser(credential.user); } catch (cleanupError) { console.error("Não foi possível desfazer o cadastro:", cleanupError); }
    throw error;
  }

  return credential.user;
}

export async function loginUser(email, password) {
  if (!isConfigured) throw new Error("CONFIGURE_FIREBASE");
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function resetPassword(email) {
  if (!isConfigured) throw new Error("CONFIGURE_FIREBASE");
  return sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  if (!isConfigured) return;
  await signOut(auth);
}
