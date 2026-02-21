'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCloseMission } from '@/hooks/useCloseMission';
import { toast } from 'sonner';

interface CloseMissionDialogProps {
  missionId: string;
}

export function CloseMissionDialog({ missionId }: CloseMissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [thanks, setThanks] = useState('');
  const closeMission = useCloseMission();

  const handleClose = () => {
    closeMission.mutate(
      { id: missionId, data: { feedback, thanks: thanks || undefined } },
      {
        onSuccess: () => {
          setStep(3);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setStep(0);
      setFeedback('');
      setThanks('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Marquer comme resolue
        </Button>
      </DialogTrigger>
      <DialogContent>
        {step === 0 && (
          <>
            <DialogHeader>
              <DialogTitle>Cloturer cette mission</DialogTitle>
              <DialogDescription>
                Marquer cette mission comme resolue ?
                Cette action est irreversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={() => setStep(1)}>
                Continuer
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Comment ca s&apos;est passe ?</DialogTitle>
              <DialogDescription>
                Partagez votre retour d&apos;experience sur cette mission.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="feedback">Votre retour</Label>
              <Textarea
                id="feedback"
                placeholder="Decrivez comment la mission s'est deroulee..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(0)}>
                Retour
              </Button>
              <Button onClick={() => setStep(2)}>
                Continuer
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Remerciement aux contributeurs</DialogTitle>
              <DialogDescription>
                Envoyez un message de remerciement aux personnes qui vous ont aide (optionnel).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="thanks">Message de remerciement</Label>
              <Textarea
                id="thanks"
                placeholder="Merci a tous pour votre aide..."
                value={thanks}
                onChange={(e) => setThanks(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button
                onClick={handleClose}
                disabled={closeMission.isPending}
              >
                {closeMission.isPending ? 'Envoi...' : 'Confirmer la cloture'}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Mission resolue !
              </DialogTitle>
              <DialogDescription>
                Votre mission a ete marquee comme resolue. Les contributeurs ont ete notifies.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
