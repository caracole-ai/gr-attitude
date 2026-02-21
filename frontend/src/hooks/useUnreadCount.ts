'use client';

import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api';

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000,
  });
}
