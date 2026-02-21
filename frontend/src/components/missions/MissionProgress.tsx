'use client';

import { Progress } from '@/components/ui/progress';

interface MissionProgressProps {
  percent: number;
}

export function MissionProgress({ percent }: MissionProgressProps) {
  return (
    <div className="flex items-center gap-2">
      <Progress value={percent} className="flex-1" />
      <span className="text-xs text-muted-foreground w-10 text-right">
        {percent}%
      </span>
    </div>
  );
}
