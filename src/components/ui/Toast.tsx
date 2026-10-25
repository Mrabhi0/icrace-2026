"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const toastConfig: Record<ToastType, { icon: typeof CheckCircle; color: string }> = {
  success: { icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  error: { icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
  warning: { icon: AlertCircle, color: "text-amber-600 bg-amber-50 border-amber-200" },
  info: { icon: Info, color: "text-blue-600 bg-blue-50 border-blue-200" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => {
          const config = toastConfig[t.type];
          const Icon = config.icon;
          return (
            <div
              key={t.id}
              className={cn("flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-slide-up", config.color)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{t.message}</p>
              <button
                onClick={() => setToasts((prev) => prev.filter((p) => p.id !== t.id))}
                className="ml-2 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
