"use client";
import { useEffect, useState } from "react";
import { registerToast } from "@/hooks/useToast";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    registerToast(({ title, description, variant = "default" }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2" style={{ maxWidth: "360px" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 p-4 rounded-xl animate-fade-in-up"
          style={{
            background: t.variant === "destructive" ? "rgba(30,5,5,0.95)" : "rgba(3,20,3,0.95)",
            border: `1px solid ${t.variant === "destructive" ? "rgba(239,68,68,0.3)" : "rgba(22,163,74,0.3)"}`,
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {t.variant === "destructive" ? (
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#ef4444" }} />
          ) : (
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#22c55e" }} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: "#f0fdf4" }}>{t.title}</p>
            {t.description && (
              <p className="text-xs mt-0.5" style={{ color: "rgba(134,239,172,0.6)" }}>{t.description}</p>
            )}
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            style={{ color: "rgba(134,239,172,0.4)" }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
