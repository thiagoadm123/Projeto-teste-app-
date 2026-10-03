import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";
import firebaseConfig from "../firebase-config.js";

const requiredFields = [
  "apiKey", "authDomain", "databaseURL", "projectId",
  "storageBucket", "messagingSenderId", "appId"
];

const isConfigured = requiredFields.every((field) => {
  const value = firebaseConfig?.[field];
  return typeof value === "string" && value.trim() && !value.includes("COLE_") && !value.includes("SEU_");
});

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
  storage = getStorage(app);
}

export { app, auth, db, storage, isConfigured };
