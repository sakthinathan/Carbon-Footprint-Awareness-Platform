// useToast — simple toast interface for use in non-component code
// This is a lightweight wrapper; replace with shadcn/ui toast in production

type ToastOptions = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Global toast queue (populated by Toaster component)
let _toastFn: ((opts: ToastOptions) => void) | null = null;

export function registerToast(fn: (opts: ToastOptions) => void) {
  _toastFn = fn;
}

export function toast(opts: ToastOptions) {
  if (_toastFn) {
    _toastFn(opts);
  } else {
    // Fallback during SSR or before Toaster mounts
    console.log(`[Toast] ${opts.title}: ${opts.description || ""}`);
  }
}
