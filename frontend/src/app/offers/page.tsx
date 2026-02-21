'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OfferCard } from '@/components/offers/OfferCard';
import { useOffers } from '@/hooks/useOffers';
import { type IOfferFilters } from '@/lib/api';
import {
  MissionCategory,
  OfferType,
  CATEGORY_LABELS,
  OFFER_TYPE_LABELS,
} from '@/lib/types';

const ALL_VALUE = '__all__';

export default function OffersPage() {
  const [filters, setFilters] = useState<IOfferFilters>({ page: 1, limit: 12 });
  const { data, isLoading } = useOffers(filters);

  const updateFilter = (key: keyof IOfferFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === ALL_VALUE ? undefined : value,
      page: 1,
    }));
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Offres</h1>
        <Button asChild>
          <Link href="/offers/new">
            <Plus className="mr-2 h-4 w-4" />
            Proposer une Offre
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Input
          placeholder="Rechercher..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        <Select
          value={filters.category || ALL_VALUE}
          onValueChange={(v) => updateFilter('category', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Toutes les categories</SelectItem>
            {Object.values(MissionCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.type || ALL_VALUE}
          onValueChange={(v) => updateFilter('type', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type d'offre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les types</SelectItem>
            {Object.values(OfferType).map((ot) => (
              <SelectItem key={ot} value={ot}>
                {OFFER_TYPE_LABELS[ot]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Offer grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Chargement des offres...
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={data.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
                }
              >
                Precedent
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.page} sur {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={data.page >= data.totalPages}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
                }
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Aucune offre trouvee. Proposez la premiere !
        </div>
      )}
    </div>
  );
}
