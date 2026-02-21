'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { missionsApi } from '@/lib/api';
import type { ICreateMission } from '@/lib/types';

export function useCreateMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateMission) => missionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}
