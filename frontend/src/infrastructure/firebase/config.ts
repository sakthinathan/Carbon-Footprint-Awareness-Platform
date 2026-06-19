// Firebase client-side configuration
// Credentials loaded from frontend/.env.local
"use client";

import { getApps, getApp, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Safely initialize — only runs when API key is present (client-side with .env.local)
function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null; // Don't run on server
  if (!firebaseConfig.apiKey) return null;
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

const _app = getFirebaseApp();

export const auth: Auth | null = _app ? getAuth(_app) : null;

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");
// Optional: force account selection every time
googleProvider.setCustomParameters({ prompt: "select_account" });

export default _app;
