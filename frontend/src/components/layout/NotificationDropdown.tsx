'use client';

import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import { useMarkNotificationRead } from '@/hooks/useMarkNotificationRead';
import { Separator } from '@/components/ui/separator';

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `Il y a ${diffD}j`;
  return `Il y a ${Math.floor(diffD / 30)} mois`;
}

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationRead();

  const recent = notifications?.slice(0, 5) ?? [];

  const handleClick = (id: string, read: boolean) => {
    if (!read) {
      markRead.mutate(id);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-popover p-0 shadow-lg z-50">
      <div className="px-4 py-3 font-semibold text-sm">Notifications</div>
      <Separator />
      {recent.length > 0 ? (
        <div className="max-h-80 overflow-y-auto">
          {recent.map((notification) => (
            <button
              key={notification.id}
              className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                !notification.read ? 'bg-muted/30' : ''
              }`}
              onClick={() => handleClick(notification.id, notification.read)}
            >
              <div className="flex items-start gap-2">
                {!notification.read && (
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {timeAgo(notification.createdAt)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
          Aucune notification
        </div>
      )}
      <Separator />
      <Link
        href="/notifications"
        className="block px-4 py-3 text-center text-sm font-medium text-primary hover:bg-muted/50 transition-colors"
        onClick={onClose}
      >
        Voir toutes les notifications
      </Link>
    </div>
  );
}
