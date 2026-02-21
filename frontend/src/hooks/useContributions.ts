'use client';

import { useQuery } from '@tanstack/react-query';
import { missionsApi } from '@/lib/api';

export function useContributions(missionId: string) {
  return useQuery({
    queryKey: ['contributions', missionId],
    queryFn: () => missionsApi.getContributions(missionId),
    enabled: !!missionId,
  });
}
