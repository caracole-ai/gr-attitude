'use client';

import { useState } from 'react';
import { HandHelping, Lightbulb, Coins, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateContribution } from '@/hooks/useCreateContribution';
import {
  ContributionType,
  CONTRIBUTION_TYPE_LABELS,
} from '@/lib/types';
import { toast } from 'sonner';

const CONTRIBUTION_CONFIG: Record<
  ContributionType,
  { icon: typeof HandHelping; className: string }
> = {
  [ContributionType.PARTICIPE]: {
    icon: HandHelping,
    className: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  [ContributionType.PROPOSE]: {
    icon: Lightbulb,
    className: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  [ContributionType.FINANCE]: {
    icon: Coins,
    className: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  [ContributionType.CONSEILLE]: {
    icon: MessageCircle,
    className: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
};

interface ContributionButtonsProps {
  missionId: string;
}

export function ContributionButtons({ missionId }: ContributionButtonsProps) {
  const [openType, setOpenType] = useState<ContributionType | null>(null);
  const [message, setMessage] = useState('');
  const mutation = useCreateContribution();

  const handleSubmit = () => {
    if (!openType) return;
    mutation.mutate(
      { type: openType, missionId, message: message || undefined },
      {
        onSuccess: () => {
          toast.success('Contribution ajoutee !');
          setOpenType(null);
          setMessage('');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {Object.values(ContributionType).map((type) => {
          const config = CONTRIBUTION_CONFIG[type];
          const Icon = config.icon;
          return (
            <Button
              key={type}
              className={config.className}
              onClick={() => setOpenType(type)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {CONTRIBUTION_TYPE_LABELS[type]}
            </Button>
          );
        })}
      </div>

      <Dialog open={!!openType} onOpenChange={(open) => !open && setOpenType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {openType && CONTRIBUTION_TYPE_LABELS[openType]}
            </DialogTitle>
            <DialogDescription>
              Ajoutez un message optionnel pour accompagner votre contribution.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="contribution-message">Message (optionnel)</Label>
            <Textarea
              id="contribution-message"
              placeholder="Votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenType(null)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={mutation.isPending}>
              {mutation.isPending ? 'Envoi...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
