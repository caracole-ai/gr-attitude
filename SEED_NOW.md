# 🚀 SEED MAINTENANT !

## Statut Actuel

✅ Code pushé (commit `b57b0d4`)  
⏳ Render est en train de déployer le backend...

---

## 🎯 Ce que tu dois faire

### 1️⃣ Attendre que le deploy soit Live

👉 Aller sur : https://dashboard.render.com/web/srv-d6f4cshr0fns73f2vvsg

**Attendre** que le dernier deploy (commit `b57b0d4`) soit **Live** (badge vert).

---

### 2️⃣ Ouvrir le Shell Render

1. Sur la page du service `gr-attitude-api`, cliquer sur l'onglet **"Shell"** en haut
2. Attendre que le terminal se connecte (quelques secondes)

---

### 3️⃣ Lancer le seeding

Dans le Shell, copier-coller cette commande :

```bash
npm run seed
```

**Tu devrais voir :**
```
🌱 Seeding demo data...
  → Creating demo users...
  ✅ Created 5 demo users
  → Creating demo missions...
  ✅ Created 6 demo missions
  → Creating demo offers...
  ✅ Created 4 demo offers
  → Creating demo contributions...
  ✅ Created 4 demo contributions
🎉 Demo data seeded successfully!
```

---

### 4️⃣ Tester sur le frontend

👉 Aller sur : https://gr-attitude-frontend.onrender.com

1. **Se connecter avec Google OAuth**
2. Naviguer vers `/missions`
3. **Tu devrais voir 6 missions** avec des créateurs, tags, contributions

---

## 📖 Documentation Complète

Voir `docs/SEEDING_GUIDE.md` pour :
- Liste détaillée des données générées
- Comment supprimer les données démo plus tard
- Dépannage

---

## ⚠️ Note Importante

Les utilisateurs démo utilisent des emails `.test` (invalides pour OAuth).  
**Connecte-toi avec ton propre compte Google** pour voir les données !

---

Bon test ! 🎉
