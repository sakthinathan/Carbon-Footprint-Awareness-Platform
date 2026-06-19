// Axios API client with Firebase token injection + error handling
import axios, { AxiosError, AxiosInstance } from "axios";
import { getIdToken } from "@/infrastructure/firebase/auth";
import { toast } from "@/hooks/useToast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_URL,
    timeout: 30_000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // ── Request Interceptor: inject Firebase ID token ─────────────────────────
  client.interceptors.request.use(async (config) => {
    const token = await getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ── Response Interceptor: handle errors globally ──────────────────────────
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ error: { code: string; message: string } }>) => {
      if (!error.response) {
        toast({
          title: "Network Error",
          description: "Unable to reach the server. Please check your connection.",
          variant: "destructive",
        });
        return Promise.reject(error);
      }

      const { status, data } = error.response;
      const message = data?.error?.message || "An unexpected error occurred";

      switch (status) {
        case 401:
          toast({ title: "Session Expired", description: "Please sign in again.", variant: "destructive" });
          window.location.href = "/login";
          break;
        case 403:
          toast({ title: "Access Denied", description: message, variant: "destructive" });
          break;
        case 422:
          toast({ title: "Validation Error", description: message, variant: "destructive" });
          break;
        case 429:
          toast({ title: "Too Many Requests", description: "Please slow down and try again.", variant: "destructive" });
          break;
        case 500:
          toast({ title: "Server Error", description: "Something went wrong on our end.", variant: "destructive" });
          break;
        default:
          if (status >= 400) {
            toast({ title: "Error", description: message, variant: "destructive" });
          }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export const apiClient = createApiClient();
