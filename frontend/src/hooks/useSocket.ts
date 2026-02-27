import { useEffect, useCallback } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';

type SocketEventCallback = (data: any) => void;

export function useSocket() {
  const socket = getSocket();

  const on = useCallback(
    (event: string, callback: SocketEventCallback) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    [socket]
  );

  const off = useCallback(
    (event: string, callback?: SocketEventCallback) => {
      if (socket) {
        socket.off(event, callback);
      }
    },
    [socket]
  );

  const emit = useCallback(
    (event: string, data?: any) => {
      if (socket?.connected) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  return {
    socket,
    connected: socket?.connected || false,
    on,
    off,
    emit,
  };
}

/**
 * Hook to listen to a specific socket event
 * Automatically cleans up on unmount
 */
export function useSocketEvent(
  event: string,
  callback: SocketEventCallback,
  deps: any[] = []
) {
  const { on, off } = useSocket();

  useEffect(() => {
    on(event, callback);
    return () => off(event, callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps]);
}

/**
 * Hook to connect/disconnect socket based on auth state
 */
export function useSocketAuth(token: string | null) {
  useEffect(() => {
    if (token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }

    return () => {
      // Don't disconnect on component unmount - keep connection alive
    };
  }, [token]);
}
