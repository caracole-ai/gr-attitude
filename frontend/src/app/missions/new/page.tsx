'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateMission } from '@/hooks/useCreateMission';
import {
  MissionCategory,
  HelpType,
  Urgency,
  Visibility,
  CATEGORY_LABELS,
  HELP_TYPE_LABELS,
  URGENCY_LABELS,
  VISIBILITY_LABELS,
  type ICreateMission,
} from '@/lib/types';
import { toast } from 'sonner';

const STEPS = [
  'Description',
  'Classification',
  'Visibilite',
  'Confirmation',
];

export default function NewMissionPage() {
  const router = useRouter();
  const createMission = useCreateMission();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ICreateMission>({
    title: '',
    description: '',
    category: MissionCategory.AUTRE,
    helpType: HelpType.CONSEIL,
    urgency: Urgency.MOYEN,
    visibility: Visibility.PUBLIC,
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState('');

  const updateForm = <K extends keyof ICreateMission>(
    key: K,
    value: ICreateMission[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canNext = () => {
    if (step === 0) return form.title.trim() !== '' && form.description.trim() !== '';
    return true;
  };

  const handleSubmit = () => {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    createMission.mutate(
      { ...form, tags },
      {
        onSuccess: (mission) => {
          toast.success('Mission creee !');
          router.push(`/missions/${mission.id}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Creer une Mission</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`hidden text-sm sm:inline ${
                i <= step ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="h-px w-4 bg-border sm:w-8" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Title + Description */}
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="De quoi avez-vous besoin ?"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Decrivez votre besoin en detail..."
                  rows={5}
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Step 2: Category, HelpType, Urgency */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Categorie</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    updateForm('category', v as MissionCategory)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MissionCategory).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type d&apos;aide</Label>
                <Select
                  value={form.helpType}
                  onValueChange={(v) =>
                    updateForm('helpType', v as HelpType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(HelpType).map((ht) => (
                      <SelectItem key={ht} value={ht}>
                        {HELP_TYPE_LABELS[ht]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Urgence</Label>
                <Select
                  value={form.urgency}
                  onValueChange={(v) =>
                    updateForm('urgency', v as Urgency)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Urgency).map((u) => (
                      <SelectItem key={u} value={u}>
                        {URGENCY_LABELS[u]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Step 3: Visibility + Tags */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label>Visibilite</Label>
                <Select
                  value={form.visibility}
                  onValueChange={(v) =>
                    updateForm('visibility', v as Visibility)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Visibility).map((vis) => (
                      <SelectItem key={vis} value={vis}>
                        {VISIBILITY_LABELS[vis]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separes par des virgules)</Label>
                <Input
                  id="tags"
                  placeholder="aide, urgent, paris..."
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 4: Preview */}
          {step === 3 && (
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Titre
                </span>
                <p className="font-semibold">{form.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Description
                </span>
                <p className="text-sm">{form.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {CATEGORY_LABELS[form.category]}
                </Badge>
                <Badge variant="outline">
                  {HELP_TYPE_LABELS[form.helpType]}
                </Badge>
                <Badge variant="outline">
                  {URGENCY_LABELS[form.urgency]}
                </Badge>
                <Badge variant="outline">
                  {VISIBILITY_LABELS[form.visibility]}
                </Badge>
              </div>
              {tagsInput && (
                <div className="flex flex-wrap gap-1">
                  {tagsInput
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          Precedent
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
          >
            Suivant
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={createMission.isPending}
          >
            {createMission.isPending ? 'Creation...' : 'Creer la Mission'}
          </Button>
        )}
      </div>
    </div>
  );
}
