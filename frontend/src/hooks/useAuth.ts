// useAuth hook — Firebase auth state management
"use client";

import { useEffect, useState, useCallback } from "react";
import { User } from "firebase/auth";
import { onAuthChange, signInWithGoogle, signOut } from "@/infrastructure/firebase/auth";
import { useRouter } from "next/navigation";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setState({ user, loading: false, error: null });
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      setState((s) => ({ ...s, loading: false, error: err.message }));
    }
  }, [router]);

  const logout = useCallback(async () => {
    await signOut();
    router.push("/login");
  }, [router]);

  return { ...state, login, logout };
}
