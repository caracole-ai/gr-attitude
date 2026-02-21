'use client';

import { useQuery } from '@tanstack/react-query';
import { missionsApi } from '@/lib/api';

export function useMission(id: string) {
  return useQuery({
    queryKey: ['mission', id],
    queryFn: () => missionsApi.get(id),
    enabled: !!id,
  });
}
