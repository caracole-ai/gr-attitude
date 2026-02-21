'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { offersApi } from '@/lib/api';
import type { ICreateOffer } from '@/lib/types';

export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateOffer) => offersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}
