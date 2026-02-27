# Seeding de données de démonstration

## Vue d'ensemble

Le script `seed-demo.sql` charge des données de test réalistes dans la base de données SQLite.

## Contenu du seed

- **20 utilisateurs** avec avatars et compétences variées
- **55 missions** (urgentes, moyennes, faibles) dans toutes les catégories
- **35 offres** de services et matériel variés
- **10 contributions** d'utilisateurs sur missions
- **47 corrélations** (matches IA mission-offre avec scores 70-98%)

**Mot de passe démo** : `Demo123!` (bcrypt hash dans le SQL)

## Utilisation

### Charger les données de démo

```bash
npm run seed:demo
```

Ou directement avec SQLite :

```bash
sqlite3 gr_attitude.sqlite < seed-demo.sql
```

### Réinitialiser la base (vider toutes les données)

```bash
npm run seed:reset
```

### Réinitialiser + charger les données

```bash
npm run seed:full
```

## Comptes de test

Tous les utilisateurs ont le même mot de passe : **Demo123!**

**Exemples de comptes** :
- `marie.dubois@email.fr` - Marie Dubois (JavaScript, Design)
- `pierre.martin@email.fr` - Pierre Martin (Plomberie, Bricolage)
- `sophie.bernard@email.fr` - Sophie Bernard (Cuisine, Jardinage)
- `thomas.petit@email.fr` - Thomas Petit (TypeScript, React)
- `julie.roux@email.fr` - Julie Roux (Marketing, Langues)

... et 15 autres utilisateurs (voir `seed-demo.sql` pour la liste complète)

## Catégories de missions

Le seed inclut des missions variées :
- **Déménagement** - aide transport, camionnette
- **Bricolage** - plomberie, électricité, menuiserie, peinture
- **Numérique** - dépannage informatique, configuration réseau, site web
- **Éducation** - cours langues, soutien scolaire, informatique seniors
- **Garde** - enfants, animaux
- **Transport** - covoiturage, prêt véhicule
- **Jardinage** - potager, tonte, taille
- **Loisirs** - musique, couture, photographie, sport
- **Alimentation** - cours cuisine, conserves
- **Bien-être** - yoga, méditation, massage

## Corrélations (Matching IA)

Le seed crée des corrélations réalistes entre missions et offres, avec des scores de pertinence entre 70 et 98.

**Exemples** :
- Mission "Réparation fuite eau" → Offre "Plomberie et sanitaire" (score 93)
- Mission "Cours informatique seniors" → Offre "Cours informatique seniors" (score 95)
- Mission "Garde chat vacances" → Offre "Garde animaux domicile" (score 98)

Ces corrélations permettent de tester l'interface de matching sans avoir à attendre que l'IA génère de nouveaux matches.

## Vérifier les données chargées

```bash
sqlite3 gr_attitude.sqlite "
  SELECT COUNT(*) as users FROM users;
  SELECT COUNT(*) as missions FROM missions;
  SELECT COUNT(*) as offers FROM offers;
  SELECT COUNT(*) as contributions FROM contributions;
  SELECT COUNT(*) as correlations FROM correlations;
"
```

Résultat attendu :
```
20
55
35
10
47
```

## Note

Ce script **supprime** toutes les données existantes avant de charger les données de démo (voir les `DELETE` en début de fichier).

⚠️ **Ne jamais exécuter en production !** Ces données sont pour le développement et les tests uniquement.
