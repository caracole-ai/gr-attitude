'use client';

import { useQuery } from '@tanstack/react-query';
import { offersApi, type IOfferFilters } from '@/lib/api';

export function useOffers(filters?: IOfferFilters) {
  return useQuery({
    queryKey: ['offers', filters],
    queryFn: () => offersApi.list(filters),
  });
}
