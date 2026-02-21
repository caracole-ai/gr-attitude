'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { missionsApi, type ICloseMissionData } from '@/lib/api';

export function useCloseMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ICloseMissionData }) =>
      missionsApi.close(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mission', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}
