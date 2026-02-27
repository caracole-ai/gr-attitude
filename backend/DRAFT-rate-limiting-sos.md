# DRAFT — Rate Limiting SOS (Phase 1)

**Feature** : Mode SOS avec protection anti-abuse

**Problème** : Un user pourrait spam le bouton SOS → Pollution du matching

**Solution** : Rate limit 3 activations SOS par jour par user

---

## Code à Ajouter

### 1. Controller (missions.controller.ts)

```typescript
import { Throttle } from '@nestjs/throttler';

@Controller('missions')
export class MissionsController {
  // ... existing code ...

  /**
   * Activer le mode SOS pour une mission
   * Rate limit: 3 activations par jour par user
   */
  @Post(':id/sos')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 86400000 } }) // 3 requêtes / 24h
  async activateSOS(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.missionsService.activateSOS(id, user.id);
  }

  /**
   * Désactiver le mode SOS
   * Pas de rate limit (désactiver = toujours OK)
   */
  @Delete(':id/sos')
  @UseGuards(JwtAuthGuard)
  async deactivateSOS(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.missionsService.deactivateSOS(id, user.id);
  }
}
```

### 2. Service (missions.service.ts)

```typescript
export class MissionsService {
  // ... existing code ...

  async activateSOS(missionId: string, userId: string): Promise<Mission> {
    const mission = await this.findOne(missionId);

    // Vérifier que l'user est le créateur
    if (mission.creatorId !== userId) {
      throw new ForbiddenException('Only mission creator can activate SOS mode');
    }

    // Vérifier que la mission n'est pas déjà fermée
    if (mission.status === MissionStatus.CLOSED) {
      throw new BadRequestException('Cannot activate SOS on closed mission');
    }

    // Vérifier que SOS n'est pas déjà actif
    if (mission.isSos) {
      throw new BadRequestException('SOS mode already active');
    }

    // Activer SOS
    mission.isSos = true;
    mission.urgency = 'urgent'; // Forcer urgence haute
    await this.missionsRepository.save(mission);

    // TODO Phase 2 : Envoyer push notif aux 10 meilleurs matchs
    // await this.notificationsService.notifySOSMatches(mission);

    return mission;
  }

  async deactivateSOS(missionId: string, userId: string): Promise<Mission> {
    const mission = await this.findOne(missionId);

    if (mission.creatorId !== userId) {
      throw new ForbiddenException('Only mission creator can deactivate SOS mode');
    }

    if (!mission.isSos) {
      throw new BadRequestException('SOS mode not active');
    }

    mission.isSos = false;
    await this.missionsRepository.save(mission);

    return mission;
  }
}
```

### 3. Entity (mission.entity.ts)

```typescript
@Entity('missions')
export class Mission {
  // ... existing columns ...

  @Column({ type: 'boolean', default: false })
  isSos: boolean; // Mode SOS actif

  // ... rest of entity ...
}
```

### 4. Migration (à créer après validation)

```bash
npm run migration:generate -- src/migrations/AddSosToMissions
```

Contenu :
```sql
ALTER TABLE missions ADD COLUMN isSos BOOLEAN DEFAULT FALSE;
CREATE INDEX IDX_missions_isSos ON missions(isSos) WHERE isSos = TRUE;
```

---

## Matching Logic Update

### matching.service.ts

```typescript
calculateMatchScore(mission: Mission, offer: Offer): number {
  let baseScore = 0;

  // ... existing scoring logic ...

  // Boost SOS : +50 points
  if (mission.isSos) {
    baseScore += 50;
  }

  return Math.min(baseScore, 110); // Cap à 110
}
```

---

## Frontend Integration (Draft)

### Mission Detail Page

```tsx
// components/missions/SOSButton.tsx
export function SOSButton({ missionId, isSos, isOwner }: Props) {
  const [activating, setActivating] = useState(false);

  const handleSOS = async () => {
    if (!isOwner) return;
    
    setActivating(true);
    try {
      if (isSos) {
        await api.delete(`/missions/${missionId}/sos`);
        toast.success('Mode SOS désactivé');
      } else {
        await api.post(`/missions/${missionId}/sos`);
        toast.success('🚨 Mode SOS activé ! Les meilleurs matchs seront notifiés.');
      }
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error('Limite atteinte : 3 activations SOS par jour maximum');
      } else {
        toast.error('Erreur lors de l\'activation du mode SOS');
      }
    } finally {
      setActivating(false);
    }
  };

  if (!isOwner) return null;

  return (
    <Button
      variant={isSos ? 'destructive' : 'default'}
      onClick={handleSOS}
      disabled={activating}
      className={isSos ? 'animate-pulse' : ''}
    >
      {isSos ? (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          Mode SOS Actif
        </>
      ) : (
        <>
          <Zap className="mr-2 h-4 w-4" />
          Activer Mode SOS
        </>
      )}
    </Button>
  );
}
```

---

## Tests E2E à Ajouter

### missions-sos.e2e-spec.ts

```typescript
describe('Missions SOS (e2e)', () => {
  it('should activate SOS mode', async () => {
    const response = await request(app.getHttpServer())
      .post(`/missions/${missionId}/sos`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.isSos).toBe(true);
    expect(response.body.urgency).toBe('urgent');
  });

  it('should rate limit SOS activation to 3 per day', async () => {
    // Activer 3 fois
    for (let i = 0; i < 3; i++) {
      await request(app.getHttpServer())
        .post(`/missions/${missionId}/sos`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      // Désactiver entre chaque
      await request(app.getHttpServer())
        .delete(`/missions/${missionId}/sos`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    }

    // 4ème tentative = rate limited
    await request(app.getHttpServer())
      .post(`/missions/${missionId}/sos`)
      .set('Authorization', `Bearer ${token}`)
      .expect(429); // Too Many Requests
  });

  it('should prevent non-owner from activating SOS', async () => {
    await request(app.getHttpServer())
      .post(`/missions/${missionId}/sos`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .expect(403);
  });
});
```

---

## Documentation Utilisateur

**Mode SOS** 🚨

Le mode SOS permet de booster la visibilité de votre mission en cas d'urgence critique.

**Fonctionnement** :
- Boost du score de matching (+50 points)
- Urgence forcée à "Urgent"
- Notification push aux 10 meilleurs matchs (Phase 2)

**Limites** :
- Maximum 3 activations par jour
- Réservé aux urgences réelles (risque de ban si abuse)
- Désactivation illimitée

**Quand utiliser** :
- ✅ Déménagement dans 2h, besoin d'aide immédiate
- ✅ Panne informatique critique avant présentation
- ❌ Mission normale (utilise le système standard)

---

## Monitoring & Analytics

### Métriques à tracker (Sentry/Datadog)

- **SOS activations per day** (global + per user)
- **SOS → Match conversion rate**
- **Average time SOS active**
- **Rate limit 429 errors** (abuse detection)

### Alertes

- Si >10 SOS 429 errors/hour → Possible spam attack
- Si SOS conversion rate <20% → Feature pas utile / abuse

---

## Prochaines Itérations

**Phase 2** (après validation Phase 1) :
- Push notifications aux meilleurs matchs
- Badge "Sauveur SOS" si réponse <1h
- Leaderboard "Sauveurs du Mois"

**Phase 3** :
- Machine Learning : Prédire si SOS vraiment nécessaire
- Auto-désactivation si pas de réponse après 24h
