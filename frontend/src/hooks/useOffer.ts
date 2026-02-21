'use client';

import { useQuery } from '@tanstack/react-query';
import { offersApi } from '@/lib/api';

export function useOffer(id: string) {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: () => offersApi.get(id),
    enabled: !!id,
  });
}
