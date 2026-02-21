'use client';

import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/lib/api';

export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: () => statsApi.get(),
  });
}
