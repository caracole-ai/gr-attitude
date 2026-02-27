import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  socket = io(apiUrl, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('[WebSocket] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[WebSocket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[WebSocket] Connection error:', error.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[WebSocket] Manually disconnected');
  }
}
