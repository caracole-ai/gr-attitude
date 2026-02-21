'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MissionCard } from '@/components/missions/MissionCard';
import { useMissions } from '@/hooks/useMissions';

export default function HomePage() {
  const { data } = useMissions({ limit: 6 });

  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            GR attitude
          </h1>
          <p className="text-xl text-muted-foreground">
            Trouvez des solutions, Soyez la solution. Tout simplement.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/missions/new">Creer une Mission</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/offers/new">Proposer une Offre</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent missions */}
      {data?.data && data.data.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Missions recentes</h2>
              <Button variant="ghost" asChild>
                <Link href="/missions">Voir tout</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
