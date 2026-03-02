'use client';

import { useEffect, useState } from 'react';
import { AuthRequiredModal } from './AuthRequiredModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * Global listener: any 401/403 from fetchApi triggers the auth modal.
 * Mount once in layout.
 */
export function AuthGuard() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handler = () => {
      if (!user) setOpen(true);
    };
    window.addEventListener('auth:required', handler);
    return () => window.removeEventListener('auth:required', handler);
  }, [user]);

  // Close if user logs in
  useEffect(() => {
    if (user) setOpen(false);
  }, [user]);

  return <AuthRequiredModal open={open} onOpenChange={setOpen} />;
}
