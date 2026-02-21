'use client';

import { useQuery } from '@tanstack/react-query';
import { missionsApi } from '@/lib/api';
import type { IMissionFilters } from '@/lib/types';

export function useMissions(filters?: IMissionFilters) {
  return useQuery({
    queryKey: ['missions', filters],
    queryFn: () => missionsApi.list(filters),
  });
}
