# PRD — GR attitude

## Product Requirements Document v1.0

---

## 1. Vision & Positionnement

**GR attitude** est une plateforme sociale d'entraide structurée — un réseau social orienté action, pas visibilité.

> *« Trouvez des solutions, Soyez la solution. Tout simplement. »*

### Problème adressé

- Les besoins existent mais sont mal formulés.
- Les aidants existent mais ne savent pas où intervenir.
- L'entraide est émotionnelle mais désorganisée.

### Solution

Un système de **ticketing humain** simple, responsabilisant et gratifiant. Chaque besoin devient une **Mission**, chaque proposition d'aide devient une **Offre**. La plateforme structure l'intention et la transforme en action concrète mesurable.

### Ce que nous sommes

- Une infrastructure d'entraide structurée.
- Un réseau social d'action à cycle de vie (début → avancement → clôture).
- Un système de corrélation Missions ↔ Offres.

### Ce que nous ne sommes PAS

- Pas une plateforme d'assistanat ni d'infantilisation.
- Pas de gamification agressive ni de compétition entre aidants.
- Pas de jugement moral sur les demandes.
- Pas de monétisation de l'émotion ni de dépendance comportementale.

---

## 2. Proposition de valeur

| Persona | Valeur |
|---|---|
| **Demandeur** | Clarifier son besoin, être accompagné dans la formulation, recevoir des réponses concrètes, se sentir légitime |
| **Aidant** | Identifier des besoins réels, choisir son niveau d'engagement, voir l'impact de son action, être reconnu |
| **Partenaire** | Soutenir des besoins structurés, mesurer l'impact, associer son image à des résolutions concrètes |

---

## 3. Principes produit non négociables

1. **Simplicité radicale** — friction minimale à la publication d'un besoin.
2. **Responsabilisation bilatérale** — demandeur ET aidant sont acteurs.
3. **Transparence des résolutions** — historique immuable, progression visible.
4. **Gratification non toxique** — valorisation sans glorification, pas d'ego system.
5. **Aucune humiliation du demandeur.**
6. **Moins de scroll, plus d'action.**

---

## 4. Objets métier centraux

### 4.1 Mission (demande structurée)

| Champ | Type | Description |
|---|---|---|
| `id` | UUID | Identifiant unique |
| `creator_id` | UUID | Référence au créateur |
| `title` | string (max 120 car.) | Titre clair du besoin |
| `description` | text | Description synthétique guidée |
| `category` | enum | Catégorie thématique (voir taxonomie §5) |
| `help_type` | enum | `financière` · `conseil` · `matériel` · `relation` |
| `urgency` | enum | `faible` · `moyen` · `urgent` |
| `visibility` | enum | `public` · `groupe` · `privé` |
| `location` | point (lat/lng) + rayon | Localisation géographique |
| `status` | enum | `ouverte` · `en_cours` · `résolue` · `expirée` |
| `progress_percent` | int (0-100) | Pourcentage d'avancement |
| `participants` | array[user_id] | Liste des participants engagés |
| `created_at` | datetime | Date de création |
| `expires_at` | datetime | Date d'expiration (défaut : created_at + 30 jours) |
| `closed_at` | datetime | Date de clôture (null si non clôturée) |
| `tags` | array[string] | Tags pour le matching |

**Règles métier :**

- Clôture **uniquement par le créateur**.
- Expiration automatique à J+30 (notification de rappel à J+25).
- Notification aux participants à la clôture.
- Possibilité de remerciement personnalisé à la clôture.
- Historique conservé dans le profil personnel (non public).

### 4.2 Offre (proposition libre)

Même structure simplifiée que Mission, avec :

| Champ supplémentaire | Type | Description |
|---|---|---|
| `offer_type` | enum | `don` · `compétence` · `matériel` · `service` · `écoute` |
| `availability` | text | Disponibilité décrite librement |
| `correlated_missions` | array[mission_id] | Missions corrélées automatiquement |

**Règles métier :**

- Corrélation automatique avec les Missions ouvertes (voir §6).
- Même cycle de vie : ouverte → en cours → clôturée / expirée.

### 4.3 Contribution (engagement sur une Mission)

| Champ | Type | Description |
|---|---|---|
| `id` | UUID | Identifiant |
| `user_id` | UUID | Référence au contributeur |
| `mission_id` | UUID | Référence à la Mission |
| `type` | enum | `participe` · `propose` · `finance` · `conseille` |
| `message` | text | Message optionnel |
| `created_at` | datetime | Date d'engagement |
| `status` | enum | `active` · `terminée` · `annulée` |

---

## 5. Taxonomie des catégories

Liste initiale (à affiner en beta) :

- Déménagement / logistique
- Bricolage / réparation
- Numérique / informatique
- Administratif / juridique
- Garde d'enfants / famille
- Transport / mobilité
- Écoute / soutien moral
- Emploi / orientation
- Alimentation / courses
- Animaux
- Éducation / soutien scolaire
- Autre

---

## 6. Système de corrélation (Matching)

Algorithme de rapprochement automatique Missions ↔ Offres basé sur :

| Critère | Poids | Méthode |
|---|---|---|
| **Tags & catégorie** | Élevé | Correspondance exacte + similarité sémantique |
| **Proximité géographique** | Élevé | Distance haversine avec rayon configurable |
| **Type d'aide** | Moyen | Correspondance help_type ↔ offer_type |
| **Temporalité** | Moyen | Missions ouvertes récentes priorisées |

**Implémentation MVP :** matching par tags et catégorie + géolocalisation. La similarité sémantique (NLP) est reportée en phase 2.

---

## 7. Système de gratification

### Principes

- Pas de score public comparatif.
- Pas de classement compétitif agressif.
- Statistiques personnelles **privées** (visibles uniquement par l'utilisateur).

### Éléments

| Élément | Description |
|---|---|
| **Indice de contribution** | Compteur personnel privé : missions créées, contributions, résolutions |
| **Badge "Gratifieur"** | Décerné discrètement après X contributions |
| **Historique d'impact** | Timeline personnelle des missions résolues |
| **Top contributeurs** | Liste valorisante (non compétitive), opt-in uniquement |
| **Remerciements** | Message de remerciement du demandeur au contributeur à la clôture |

---

## 8. Cagnotte intégrée

Pour les missions de type `financière` :

- Cagnotte ciblée, transparente, liée à une Mission spécifique.
- Montant objectif visible.
- Suivi des contributions financières.
- Transactions encadrées via Stripe.
- Micro-commission sur transactions (modèle de revenus).

---

## 9. Parcours utilisateurs (User Flows)

### 9.1 Écran d'accueil

L'écran d'accueil est un **tableau d'actions**, pas un mur social :

```
┌─────────────────────────────────┐
│         GR attitude             │
├─────────────────────────────────┤
│                                 │
│    ┌─────────────────────┐      │
│    │   CRÉER UNE MISSION │      │  ← CTA principal
│    └─────────────────────┘      │
│    ┌─────────────────────┐      │
│    │   PROPOSER UNE OFFRE│      │  ← CTA secondaire
│    └─────────────────────┘      │
│                                 │
│  [Filtres : catégorie · proximité · urgence]
│                                 │
│  ┌─ Fil des Missions ─────────┐ │
│  │ 🟢 Mission 1 — 60%        │ │
│  │ 🟡 Mission 2 — 20%        │ │
│  │ 🔴 Mission 3 — Urgent     │ │
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

### 9.2 Création d'une Mission (flow guidé)

1. Choix du type : **Demander** ou **Proposer**
2. Questionnaire court et guidé :
   - Titre (champ libre avec suggestions)
   - Description (reformulation automatique assistée IA)
   - Catégorie (sélection)
   - Type d'aide attendue (sélection)
   - Niveau d'urgence (sélection)
   - Localisation (auto-détection + ajustement)
   - Visibilité (public / groupe / privé)
   - Tags (suggestion automatique)
3. Prévisualisation
4. Publication

**Principe UX :** aide à la clarification sans contrainte. Le formulaire reformule et structure, il n'empêche pas.

### 9.3 Page Mission (ticket)

```
┌─────────────────────────────────┐
│ [Catégorie] · [Urgence]        │
│ TITRE DE LA MISSION             │
│ Par @utilisateur · il y a 2h   │
├─────────────────────────────────┤
│ Description complète            │
│ Type d'aide : Matériel          │
│ Localisation : Marseille 13008  │
├─────────────────────────────────┤
│ ████████░░░░ 60% résolu         │  ← Barre de progression
├─────────────────────────────────┤
│ [Je participe] [Je propose]     │
│ [Je finance]  [Je conseille]    │  ← Boutons d'engagement
├─────────────────────────────────┤
│ Historique des contributions    │
│ └─ @aidant1 a proposé...       │
│ └─ @aidant2 participe...       │
├─────────────────────────────────┤
│ Expire dans 24 jours           │
└─────────────────────────────────┘
```

### 9.4 Engagement

1. Clic sur un bouton d'engagement (`participe` / `propose` / `finance` / `conseille`)
2. Message optionnel
3. Confirmation
4. Notification au créateur de la Mission
5. Apparition dans l'historique de la Mission

### 9.5 Clôture

1. Le créateur clique sur « Marquer comme résolu »
2. Feedback optionnel (comment ça s'est passé)
3. Remerciement optionnel aux contributeurs
4. Notification de clôture à tous les participants
5. Archivage dans l'historique personnel

---

## 10. Modèle économique (Business Model)

### 10.1 Freemium responsable

| | Gratuit | Premium |
|---|---|---|
| Publication de Missions | ✅ | ✅ |
| Participation aux résolutions | ✅ | ✅ |
| Accès au réseau | ✅ | ✅ |
| Visibilité public / restreinte | ✅ | ✅ |
| Mise en avant prioritaire | ❌ | ✅ |
| Statistiques d'impact détaillées | ❌ | ✅ |
| Historique avancé | ❌ | ✅ |
| Groupes privés élargis | ❌ | ✅ |

### 10.2 Partenaires / Distributeurs

- **Entreprises locales :** badge "Partenaire Résolution", visibilité catégorie, contribution fléchée.
- **Institutions / Associations :** tableau de bord impact, groupe communautaire dédié, sponsoring de résolutions.

### 10.3 Revenus complémentaires

- Micro-commission sur transactions financières (cagnottes).
- Abonnement entreprise.
- Sponsoring de catégorie.
- Top Gratifieurs sponsorisé.

---

## 11. Spécifications techniques

### 11.1 Stack technologique

| Couche | Technologie | Justification |
|---|---|---|
| **Mobile** | React Native ou Flutter | Cross-platform iOS + Android |
| **API Backend** | Node.js / NestJS | Performance, écosystème, scalabilité |
| **Base de données** | PostgreSQL (managé) | Relationnel robuste, PostGIS pour géo |
| **Cache** | Redis (managé) | Sessions, rate limiting, cache fréquent |
| **Authentification** | OAuth2 + email/password | JWT tokens, bcrypt/Argon2 pour hash |
| **Paiement** | Stripe | Cagnottes, micro-commissions |
| **Stockage fichiers** | AWS S3 / GCS | Photos, documents, médias |
| **CDN** | Cloudflare | Protection DDoS, cache global, SSL |
| **CI/CD** | GitHub Actions | Déploiement automatisé |
| **Monitoring** | Prometheus + Grafana (ou Datadog) | CPU, RAM, latence, alertes |
| **Hébergement** | AWS / GCP / Azure | Cloud natif, conteneurisé |

### 11.2 Architecture

```
┌──────────────┐     ┌──────────────┐
│  App Mobile   │     │  App Web     │
│ (React Native)│     │ (React/Next) │
└──────┬───────┘     └──────┬───────┘
       │                     │
       └──────────┬──────────┘
                  │
           ┌──────▼──────┐
           │  CDN / WAF   │  (Cloudflare)
           │  + SSL       │
           └──────┬──────┘
                  │
           ┌──────▼──────┐
           │ Load Balancer│
           └──────┬──────┘
                  │
        ┌─────────┴─────────┐
        │                   │
  ┌─────▼─────┐      ┌─────▼─────┐
  │ API Node 1│      │ API Node 2│  (NestJS)
  └─────┬─────┘      └─────┬─────┘
        │                   │
        └─────────┬─────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
┌────▼────┐ ┌────▼────┐ ┌────▼────┐
│PostgreSQL│ │  Redis  │ │   S3    │
│ (PostGIS)│ │ (Cache) │ │(Médias) │
└─────────┘ └─────────┘ └─────────┘
```

### 11.3 Modèle de données (schéma simplifié)

```sql
-- Utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    location GEOGRAPHY(POINT, 4326),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Missions
CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(id) NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    help_type VARCHAR(20) NOT NULL CHECK (help_type IN ('financière', 'conseil', 'matériel', 'relation')),
    urgency VARCHAR(10) NOT NULL CHECK (urgency IN ('faible', 'moyen', 'urgent')),
    visibility VARCHAR(10) NOT NULL CHECK (visibility IN ('public', 'groupe', 'privé')),
    location GEOGRAPHY(POINT, 4326),
    location_radius_km INT DEFAULT 10,
    status VARCHAR(15) NOT NULL DEFAULT 'ouverte' CHECK (status IN ('ouverte', 'en_cours', 'résolue', 'expirée')),
    progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    closed_at TIMESTAMPTZ,
    closure_feedback TEXT,
    closure_thanks TEXT
);

-- Offres
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(id) NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    offer_type VARCHAR(20) NOT NULL CHECK (offer_type IN ('don', 'compétence', 'matériel', 'service', 'écoute')),
    visibility VARCHAR(10) NOT NULL CHECK (visibility IN ('public', 'groupe', 'privé')),
    location GEOGRAPHY(POINT, 4326),
    location_radius_km INT DEFAULT 10,
    status VARCHAR(15) NOT NULL DEFAULT 'ouverte' CHECK (status IN ('ouverte', 'en_cours', 'clôturée', 'expirée')),
    tags TEXT[] DEFAULT '{}',
    availability TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    closed_at TIMESTAMPTZ
);

-- Contributions (engagements sur une Mission)
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    mission_id UUID REFERENCES missions(id) NOT NULL,
    type VARCHAR(15) NOT NULL CHECK (type IN ('participe', 'propose', 'finance', 'conseille')),
    message TEXT,
    status VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'terminée', 'annulée')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, mission_id, type)
);

-- Corrélations Mission ↔ Offre
CREATE TABLE correlations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES missions(id) NOT NULL,
    offer_id UUID REFERENCES offers(id) NOT NULL,
    score FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mission_id, offer_id)
);

-- Groupes
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES users(id) NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE group_members (
    group_id UUID REFERENCES groups(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    role VARCHAR(10) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

-- Cagnottes
CREATE TABLE fundraisers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES missions(id) UNIQUE NOT NULL,
    target_amount_cents INT NOT NULL,
    current_amount_cents INT DEFAULT 0,
    stripe_account_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fundraiser_id UUID REFERENCES fundraisers(id) NOT NULL,
    donor_id UUID REFERENCES users(id) NOT NULL,
    amount_cents INT NOT NULL,
    stripe_payment_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT,
    reference_type VARCHAR(20),
    reference_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges / Gratification
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    icon_url TEXT,
    criteria JSONB NOT NULL
);

CREATE TABLE user_badges (
    user_id UUID REFERENCES users(id) NOT NULL,
    badge_id UUID REFERENCES badges(id) NOT NULL,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- Index géospatiaux
CREATE INDEX idx_missions_location ON missions USING GIST(location);
CREATE INDEX idx_offers_location ON offers USING GIST(location);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_missions_category ON missions(category);
CREATE INDEX idx_missions_tags ON missions USING GIN(tags);
CREATE INDEX idx_offers_tags ON offers USING GIN(tags);
CREATE INDEX idx_contributions_mission ON contributions(mission_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
```

### 11.4 API — Endpoints principaux

```
AUTH
  POST   /auth/register
  POST   /auth/login
  POST   /auth/refresh
  POST   /auth/forgot-password
  DELETE /auth/account                  (droit à l'effacement RGPD)

MISSIONS
  GET    /missions                      (fil, filtres: category, help_type, urgency, proximity, tags)
  POST   /missions                      (création)
  GET    /missions/:id
  PATCH  /missions/:id                  (mise à jour progression, statut)
  POST   /missions/:id/close            (clôture par créateur)
  GET    /missions/:id/contributions
  GET    /missions/:id/correlations     (offres corrélées)

OFFRES
  GET    /offers
  POST   /offers
  GET    /offers/:id
  PATCH  /offers/:id
  POST   /offers/:id/close
  GET    /offers/:id/correlations       (missions corrélées)

CONTRIBUTIONS
  POST   /missions/:id/contributions    (s'engager)
  PATCH  /contributions/:id             (mettre à jour statut)
  DELETE /contributions/:id             (se désengager)

CAGNOTTES
  POST   /missions/:id/fundraiser       (créer cagnotte)
  POST   /fundraisers/:id/donate        (donner)
  GET    /fundraisers/:id

GROUPES
  POST   /groups
  GET    /groups
  POST   /groups/:id/members
  DELETE /groups/:id/members/:userId

UTILISATEURS
  GET    /users/me
  PATCH  /users/me
  GET    /users/me/missions
  GET    /users/me/contributions
  GET    /users/me/stats               (statistiques privées)
  GET    /users/me/badges
  GET    /users/me/notifications
  PATCH  /users/me/notifications/:id   (marquer comme lu)

MATCHING
  GET    /matching/suggestions          (suggestions corrélées pour l'utilisateur)

MODÉRATION
  POST   /reports                       (signalement)
```

### 11.5 Sécurité

| Domaine | Mesure |
|---|---|
| **Transport** | HTTPS obligatoire (TLS 1.2+) |
| **Auth** | JWT + OAuth2, refresh tokens, bcrypt/Argon2 |
| **API** | Rate limiting, validation inputs (class-validator), protection CSRF/XSS |
| **Réseau** | WAF (Cloudflare), protection DDoS, ports restreints |
| **Données** | Chiffrement au repos (DB), chiffrement en transit, sauvegardes quotidiennes (rétention 30j) |
| **RGPD** | Consentement utilisateur, droit à l'effacement, minimisation données, hébergement UE, politique de confidentialité |
| **Modération** | Signalement communautaire, modération légère assistée IA |

### 11.6 Notifications

| Événement | Canal |
|---|---|
| Nouvelle contribution sur ma Mission | Push + in-app |
| Mission corrélée à mon Offre | In-app |
| Mission clôturée (je suis participant) | Push + in-app |
| Remerciement reçu | Push + in-app |
| Mission expire dans 5 jours | Push |
| Mission expirée | In-app |
| Nouveau badge reçu | Push + in-app |
| Nouvelle donation sur cagnotte | In-app |

---

## 12. Gestion des risques produit

| Risque | Contre-mesure |
|---|---|
| Dérive vers l'assistanat | Formulaire structuré, encouragement au retour d'aide, dualité demandeur/aidant |
| Faux besoins | Validation communautaire douce, signalement, modération |
| Déséquilibre demandeurs/aidants | Mise en avant des Offres, suggestions de missions selon profil |
| Gamification excessive | Statistiques privées uniquement, pas de score public comparatif |
| Charge émotionnelle | Modération légère, pas d'exposition excessive des situations difficiles |
| Collecte de fonds non encadrée | Stripe, plafonds, CGU strictes |
| RGPD | Consentement, droit à l'effacement, minimisation, hébergement UE |
| Diffamation / fausses déclarations | CGU, signalement, modération |

---

## 13. Infrastructure & Budget

### Phase 1 — MVP (0–5 000 utilisateurs)

| Élément | Spécification | Coût/mois |
|---|---|---|
| Backend | 2× instances (2 vCPU, 4-8 GB RAM) | 80 € |
| PostgreSQL | Managé, 2 vCPU, 4-8 GB RAM, 50-100 GB SSD | 100 € |
| Redis | Managé, petite instance | 30 € |
| Stockage S3 | Scalable | 15 € |
| CDN / WAF | Cloudflare | 20 € |
| Monitoring | Prometheus + Grafana | 20 € |
| **Total** | | **~265 €/mois** |

### MVP ultra lean (budget serré)

1 instance serveur, 1 DB managée petite, pas de Redis, Cloudflare gratuit → **120–150 €/mois**.

### Phase 2 — Scale (10 000–50 000)

- Conteneurisation Docker
- Kubernetes si nécessaire
- Microservices si besoin réel
- Autoscaling horizontal + Load Balancer

---

## 14. Plan d'exécution — 12 mois

| Période | Objectifs |
|---|---|
| **Mois 1–3** | Développement MVP : création Mission, engagement, corrélation simple, clôture, notifications. Beta fermée : 50 familles, 100–150 besoins réels. Objectif = **densité**, pas volume. |
| **Mois 4–6** | Optimisation UX, ajout système de gratification, premiers partenaires. Cagnottes. |
| **Mois 7–9** | Expansion locale contrôlée : groupes de parents, associations sportives, communautés de quartier. Acquisition organique + campagne digitale. |
| **Mois 10–12** | Monétisation progressive (premium, partenaires). Structuration nationale. Recherche levée de fonds. |

---

## 15. Priorités MVP (par ordre)

1. ✅ Création de Mission (formulaire guidé)
2. ✅ Engagement sur Mission (4 types)
3. ✅ Corrélation simple (tags + géo)
4. ✅ Clôture + notification
5. ✅ Fil d'exploration avec filtres
6. ✅ Création d'Offre
7. ✅ Profil utilisateur + historique
8. ⬜ Cagnotte (Stripe)
9. ⬜ Système de gratification (badges)
10. ⬜ Groupes privés
11. ⬜ Premium
12. ⬜ Tableau de bord partenaires

**Tout le reste est secondaire.**

---

## 16. Métriques clés

| Métrique | Cible beta | Cible 12 mois |
|---|---|---|
| Téléchargements | 200 | 5 000 |
| DAU (utilisateurs actifs quotidiens) | 50 | 1 000–2 000 |
| Missions créées / semaine | 20 | 200+ |
| Taux de résolution | 40% | 60%+ |
| Temps moyen de résolution | < 15 jours | < 10 jours |
| Ratio demandeurs/aidants | 1:1 | 1:1.5 |
| NPS | > 30 | > 50 |

---

## 17. Stratégie d'acquisition

### Déclencheur viral

Chaque résolution génère un message partageable :

> *« Ce besoin a été résolu grâce à GR attitude. »*

### Narratif central

> *« Je n'imaginais pas que quelqu'un répondrait. Et pourtant. »*

### Canaux

1. **Micro-histoires vraies** de résolutions concrètes (vidéo courte, témoignages).
2. **Preuve sociale** : résolutions rapides mises en avant.
3. **Valorisation des bienfaiteurs ordinaires.**
4. **Effets de chaîne** : montrer qu'aider mène à être aidé.
5. **Collectivités locales** comme relais de diffusion.

---

*Document vivant — dernière mise à jour : février 2026*
