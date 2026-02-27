import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page non trouvée</h2>
        <p className="text-muted-foreground max-w-md">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/missions">
              <Search className="mr-2 h-4 w-4" />
              Explorer les missions
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
