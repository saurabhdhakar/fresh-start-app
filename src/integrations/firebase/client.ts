import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? "AIzaSyC5XRadypDQQAjlRLlFfBny2R_6He9QknY",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? "flexova-61c8e.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? "flexova-61c8e",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? "flexova-61c8e.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "718439462624",
  appId: env.VITE_FIREBASE_APP_ID ?? "1:718439462624:web:4f98e9819b12ab99d14285",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-NC4CQC0LHQ",
};

export const firebaseApp: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

// Analytics is browser-only — call this from a useEffect, never during SSR.
export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (!(await isSupported())) return null;
  return getAnalytics(firebaseApp);
}