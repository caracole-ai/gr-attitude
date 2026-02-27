import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) || [
      'http://localhost:3000',
    ],
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private readonly userSockets = new Map<string, Set<string>>(); // userId -> Set<socketId>

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Handle client connection
   * Authenticates via JWT token from handshake auth
   */
  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        this.logger.warn(`Client ${client.id} rejected: No token provided`);
        client.disconnect();
        return;
      }

      // Verify JWT
      const payload = await this.jwtService.verifyAsync(token);
      const userId: string = payload.sub;
      client.userId = userId;

      // Track user's socket
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      this.logger.log(
        `Client ${client.id} connected (user: ${userId})`,
      );
    } catch (error) {
      this.logger.warn(
        `Client ${client.id} rejected: Invalid token (${error.message})`,
      );
      client.disconnect();
    }
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const sockets = this.userSockets.get(client.userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(client.userId);
        }
      }
    }
    this.logger.log(`Client ${client.id} disconnected`);
  }

  /**
   * Send notification to a specific user (all their connected sockets)
   */
  sendToUser(userId: string | undefined, event: string, data: any) {
    if (!userId) return;
    
    const sockets = this.userSockets.get(userId);
    if (sockets && sockets.size > 0) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit(event, data);
      });
      this.logger.debug(
        `Sent "${event}" to user ${userId} (${sockets.size} socket(s))`,
      );
    }
  }

  /**
   * Broadcast to all connected clients
   */
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.debug(`Broadcasted "${event}" to all clients`);
  }

  /**
   * Test event handler (for debugging)
   */
  @SubscribeMessage('ping')
  handlePing(
    @ConnectedSocket() client: AuthenticatedSocket,
  ): { event: string; data: string } {
    this.logger.debug(`Ping from client ${client.id}`);
    return { event: 'pong', data: 'pong' };
  }
}
