// Firebase Auth operations — Google OAuth sign-in/out
"use client";

import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "./config";

export async function signInWithGoogle(): Promise<User> {
  if (!auth) throw new Error("Firebase not configured. Please set NEXT_PUBLIC_FIREBASE_* env vars in .env.local");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in cancelled. Please try again.");
    }
    if (error.code === "auth/network-request-failed") {
      throw new Error("Network error. Please check your connection.");
    }
    throw new Error(error.message || "Sign-in failed. Please try again.");
  }
}

export async function signOut(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

export async function getIdToken(): Promise<string | null> {
  if (!auth) return null;
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
