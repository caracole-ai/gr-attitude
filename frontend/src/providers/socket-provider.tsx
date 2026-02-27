'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSocketAuth, useSocketEvent } from '@/hooks/useSocket';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auto-connect when user is authenticated
  useSocketAuth(token);

  // Listen to real-time events
  useSocketEvent(
    'match:new',
    (data) => {
      toast({
        title: 'Nouveau match !',
        description: `Votre offre correspond à la mission "${data.mission.title}"`,
      });
      // Invalidate matching suggestions
      queryClient.invalidateQueries({ queryKey: ['matching', 'suggestions'] });
    },
    [toast, queryClient]
  );

  useSocketEvent(
    'mission:created',
    (data) => {
      toast({
        title: 'Mission créée',
        description: `"${data.missionTitle}" a été publiée`,
      });
      // Invalidate missions list
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
    [toast, queryClient]
  );

  useSocketEvent(
    'mission:closed',
    (data) => {
      toast({
        title: 'Mission résolue',
        description: `"${data.missionTitle}" a été marquée comme résolue`,
      });
      if (data.closureThanks) {
        toast({
          title: 'Merci reçu !',
          description: data.closureThanks,
          duration: 10000,
        });
      }
      // Invalidate missions and notifications
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    [toast, queryClient]
  );

  useSocketEvent(
    'contribution:new',
    (data) => {
      toast({
        title: 'Nouvelle contribution',
        description: `Quelqu'un a contribué à "${data.missionTitle}"`,
      });
      // Invalidate missions and contributions
      queryClient.invalidateQueries({ queryKey: ['missions', data.missionId] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    [toast, queryClient]
  );

  useSocketEvent(
    'thanks:received',
    (data) => {
      toast({
        title: '💙 Merci reçu !',
        description: data.message,
        duration: 10000,
      });
      // Invalidate notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    [toast, queryClient]
  );

  return <>{children}</>;
}
