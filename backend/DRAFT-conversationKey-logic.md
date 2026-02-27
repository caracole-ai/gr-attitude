# ConversationKey Logic — Implementation Guide

**Architecture** : Compromis Winston + Manolo (validé 100%)

**Concept** : 1 table `messages` avec `conversationKey` pour grouper les messages d'une conversation.

---

## 🔑 **ConversationKey Format**

### **Règle de Génération**

```typescript
// backend/src/chat/chat.service.ts

private generateConversationKey(
  user1Id: string,
  user2Id: string,
  missionId?: string,
  offerId?: string,
): string {
  // Ordre alphabétique pour garantir unicité (user1 <-> user2 = même clé)
  const [a, b] = [user1Id, user2Id].sort();

  if (missionId) {
    return `${a}_${b}_mission_${missionId}`;
  }
  
  if (offerId) {
    return `${a}_${b}_offer_${offerId}`;
  }

  // Chat général (pas lié à mission/offer)
  return `${a}_${b}`;
}
```

### **Exemples**

```typescript
// Conversation mission
generateConversationKey(
  'user-123',
  'user-456',
  'mission-789'
)
// → "user-123_user-456_mission_mission-789"

// Conversation offer
generateConversationKey(
  'user-abc',
  'user-def',
  undefined,
  'offer-ghi'
)
// → "user-abc_user-def_offer_offer-ghi"

// Chat général (Phase 2+)
generateConversationKey('user-aaa', 'user-bbb')
// → "user-aaa_user-bbb"
```

---

## 📨 **Envoyer un Message**

### **Endpoint**

```typescript
// POST /chat/messages
@Post('messages')
@UseGuards(JwtAuthGuard)
async sendMessage(
  @CurrentUser() user: User,
  @Body() dto: SendMessageDto,
): Promise<Message> {
  return this.chatService.sendMessage(dto, user.id);
}
```

### **DTO Validation**

```typescript
// src/chat/dto/send-message.dto.ts
export class SendMessageDto {
  @IsUUID()
  receiverId: string;

  @IsString()
  @MaxLength(2000)
  content: string;

  @IsUUID()
  @IsOptional()
  missionId?: string;

  @IsUUID()
  @IsOptional()
  offerId?: string;
}
```

### **Service Logic**

```typescript
// src/chat/chat.service.ts
async sendMessage(
  dto: SendMessageDto,
  senderId: string,
): Promise<Message> {
  // Générer conversationKey
  const conversationKey = this.generateConversationKey(
    senderId,
    dto.receiverId,
    dto.missionId,
    dto.offerId,
  );

  // Créer message
  const message = this.messagesRepository.create({
    id: uuidv4(),
    conversationKey,
    missionId: dto.missionId,
    offerId: dto.offerId,
    senderId,
    receiverId: dto.receiverId,
    content: dto.content,
    isRead: false,
    createdAt: new Date(),
  });

  // Sauvegarder en DB
  const savedMessage = await this.messagesRepository.save(message);

  // Émettre WebSocket event
  this.eventsGateway.emitMessageNew(conversationKey, savedMessage);

  return savedMessage;
}
```

---

## 📥 **Récupérer l'Historique**

### **Endpoint**

```typescript
// GET /chat/conversations/:key/messages?limit=50&before=<messageId>
@Get('conversations/:key/messages')
@UseGuards(JwtAuthGuard)
async getMessages(
  @Param('key') conversationKey: string,
  @Query('limit') limit = 50,
  @Query('before') beforeId?: string,
): Promise<Message[]> {
  return this.chatService.getMessages(conversationKey, limit, beforeId);
}
```

### **Service Logic**

```typescript
async getMessages(
  conversationKey: string,
  limit: number,
  beforeId?: string,
): Promise<Message[]> {
  const qb = this.messagesRepository
    .createQueryBuilder('message')
    .where('message.conversationKey = :key', { key: conversationKey })
    .orderBy('message.createdAt', 'DESC')
    .limit(limit);

  // Pagination (scroll infini)
  if (beforeId) {
    const beforeMessage = await this.messagesRepository.findOne({
      where: { id: beforeId },
    });
    if (beforeMessage) {
      qb.andWhere('message.createdAt < :before', {
        before: beforeMessage.createdAt,
      });
    }
  }

  return qb.getMany();
}
```

---

## 💬 **Lister les Conversations d'un User**

### **Endpoint**

```typescript
// GET /chat/conversations
@Get('conversations')
@UseGuards(JwtAuthGuard)
async getUserConversations(
  @CurrentUser() user: User,
): Promise<ConversationSummary[]> {
  return this.chatService.getUserConversations(user.id);
}
```

### **Service Logic**

```typescript
async getUserConversations(userId: string): Promise<ConversationSummary[]> {
  // Grouper par conversationKey, prendre le message le plus récent
  const conversations = await this.messagesRepository
    .createQueryBuilder('message')
    .select('message.conversationKey', 'conversationKey')
    .addSelect('MAX(message.createdAt)', 'lastMessageAt')
    .addSelect('message.content', 'lastMessage')
    .addSelect('message.senderId', 'otherUserId')
    .addSelect('message.receiverId', 'receiverId')
    .addSelect('message.missionId', 'missionId')
    .addSelect('message.offerId', 'offerId')
    .where('message.senderId = :userId OR message.receiverId = :userId', {
      userId,
    })
    .groupBy('message.conversationKey')
    .orderBy('lastMessageAt', 'DESC')
    .getRawMany();

  // Enrichir avec infos user/mission
  return Promise.all(
    conversations.map(async (conv) => {
      const otherUserId =
        conv.senderId === userId ? conv.receiverId : conv.senderId;

      const otherUser = await this.usersRepository.findOne({
        where: { id: otherUserId },
        select: ['id', 'firstName', 'lastName', 'avatarUrl'],
      });

      const unreadCount = await this.messagesRepository.count({
        where: {
          conversationKey: conv.conversationKey,
          receiverId: userId,
          isRead: false,
        },
      });

      return {
        conversationKey: conv.conversationKey,
        otherUser,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount,
        missionId: conv.missionId,
        offerId: conv.offerId,
      };
    }),
  );
}
```

---

## 📖 **Marquer Messages Comme Lus**

### **Endpoint**

```typescript
// PATCH /chat/conversations/:key/read
@Patch('conversations/:key/read')
@UseGuards(JwtAuthGuard)
async markAsRead(
  @Param('key') conversationKey: string,
  @CurrentUser() user: User,
): Promise<void> {
  await this.chatService.markAsRead(conversationKey, user.id);
}
```

### **Service Logic**

```typescript
async markAsRead(conversationKey: string, userId: string): Promise<void> {
  await this.messagesRepository.update(
    {
      conversationKey,
      receiverId: userId,
      isRead: false,
    },
    {
      isRead: true,
    },
  );
}
```

---

## 🔔 **WebSocket Events**

### **Gateway Events**

```typescript
// src/events/events.gateway.ts

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // User rejoint une conversation (subscribe)
  @SubscribeMessage('conversation:join')
  handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationKey: string },
  ) {
    client.join(`conv:${data.conversationKey}`);
  }

  // User quitte une conversation
  @SubscribeMessage('conversation:leave')
  handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationKey: string },
  ) {
    client.leave(`conv:${data.conversationKey}`);
  }

  // Broadcast nouveau message dans la room
  emitMessageNew(conversationKey: string, message: Message) {
    this.server.to(`conv:${conversationKey}`).emit('message:new', message);
  }

  // Broadcast typing indicator
  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationKey: string },
  ) {
    client.to(`conv:${data.conversationKey}`).emit('typing:start', {
      userId: client.data.userId,
    });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationKey: string },
  ) {
    client.to(`conv:${data.conversationKey}`).emit('typing:stop', {
      userId: client.data.userId,
    });
  }
}
```

---

## 🧪 **Tests E2E**

### **Test Suite**

```typescript
// chat.e2e-spec.ts

describe('Chat (e2e)', () => {
  it('should send a message', async () => {
    const response = await request(app.getHttpServer())
      .post('/chat/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        receiverId: otherUserId,
        missionId: missionId,
        content: 'Bonjour, je suis intéressé par votre mission !',
      })
      .expect(201);

    expect(response.body.conversationKey).toMatch(/^user-.*_user-.*_mission_mission-.*/);
    expect(response.body.content).toBe('Bonjour, je suis intéressé par votre mission !');
    expect(response.body.isRead).toBe(false);
  });

  it('should generate same conversationKey for both users', async () => {
    // User A → User B
    const msg1 = await request(app.getHttpServer())
      .post('/chat/messages')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ receiverId: userB, missionId, content: 'Test' });

    // User B → User A
    const msg2 = await request(app.getHttpServer())
      .post('/chat/messages')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ receiverId: userA, missionId, content: 'Réponse' });

    expect(msg1.body.conversationKey).toBe(msg2.body.conversationKey);
  });

  it('should retrieve conversation history', async () => {
    const response = await request(app.getHttpServer())
      .get(`/chat/conversations/${conversationKey}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].createdAt).toBeGreaterThan(response.body[1].createdAt); // DESC order
  });

  it('should list user conversations', async () => {
    const response = await request(app.getHttpServer())
      .get('/chat/conversations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body[0]).toHaveProperty('conversationKey');
    expect(response.body[0]).toHaveProperty('otherUser');
    expect(response.body[0]).toHaveProperty('unreadCount');
  });

  it('should mark messages as read', async () => {
    await request(app.getHttpServer())
      .patch(`/chat/conversations/${conversationKey}/read`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const unread = await messagesRepository.count({
      where: { conversationKey, receiverId: userId, isRead: false },
    });

    expect(unread).toBe(0);
  });
});
```

---

## 🚀 **Migration Future : 1 Table → 2 Tables**

Quand on aura besoin de groupes multi-participants (Phase 3+), migration facile :

```sql
-- Créer table conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  conversationKey VARCHAR UNIQUE NOT NULL,
  type VARCHAR CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
  name VARCHAR,
  createdAt DATETIME DEFAULT (datetime('now'))
);

-- Migrer conversationKey existantes
INSERT INTO conversations (id, conversationKey, type)
SELECT uuid_generate_v4(), DISTINCT conversationKey, 'direct'
FROM messages;

-- Ajouter FK messages → conversations
ALTER TABLE messages ADD COLUMN conversationId UUID;
UPDATE messages SET conversationId = (
  SELECT id FROM conversations WHERE conversations.conversationKey = messages.conversationKey
);
ALTER TABLE messages DROP COLUMN conversationKey;

-- Créer table conversation_participants (groupes)
CREATE TABLE conversation_participants (
  conversationId UUID REFERENCES conversations(id),
  userId UUID REFERENCES users(id),
  PRIMARY KEY (conversationId, userId)
);
```

**Avantage du compromis Winston** : Migration 0 downtime, juste ajout de tables. 🎯

---

## 📊 **Performance**

### **Index Utilisés**

1. **IDX_messages_conversation** (conversationKey, createdAt)
   - Query : `SELECT * FROM messages WHERE conversationKey = 'xxx' ORDER BY createdAt DESC`
   - Performance : O(log n) lookup

2. **IDX_messages_receiver_unread** (receiverId, isRead)
   - Query : `SELECT COUNT(*) FROM messages WHERE receiverId = 'xxx' AND isRead = 0`
   - Performance : Index scan uniquement

3. **IDX_messages_mission** (missionId, createdAt)
   - Query : `SELECT * FROM messages WHERE missionId = 'xxx' ORDER BY createdAt DESC`
   - Performance : Afficher tous les messages d'une mission

### **Optimisations**

- Pagination via `before` cursor (pas d'OFFSET)
- GROUP BY sur conversationKey (liste conversations)
- Limit 50 messages par défaut (scroll infini frontend)

---

**Tout est prêt pour l'implémentation backend ! 🚀**

Winston + Manolo, cette doc suffit pour dev le service `ChatService` ?
