// Simple toast hook for development
import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...props, id };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after duration (default 5s)
    const duration = props.duration ?? 5000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return {
      id,
      dismiss: () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      update: (props: Partial<Toast>) => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...props } : t))
        );
      },
    };
  }, []);

  return { toast, toasts };
}
