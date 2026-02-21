'use client';

import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/lib/api';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getMe(),
  });
}
