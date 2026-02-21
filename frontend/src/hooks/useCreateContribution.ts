'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contributionsApi } from '@/lib/api';
import type { ICreateContribution } from '@/lib/types';

export function useCreateContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateContribution) => contributionsApi.create(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['contributions', variables.missionId],
      });
      queryClient.invalidateQueries({
        queryKey: ['mission', variables.missionId],
      });
    },
  });
}
