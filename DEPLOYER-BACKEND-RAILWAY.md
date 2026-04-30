# 🚂 Déploiement Backend sur Railway

## ⚠️ Pourquoi Railway au lieu de Vercel ?

**Vercel** est optimisé pour les fonctions serverless légères, mais **NestJS** est un framework lourd qui nécessite :
- Une instance Node.js persistante
- Connexion base de données maintenue
- Initialisation TypeORM
- Temps de démarrage > 10 secondes

**Railway** offre :
- ✅ Conteneurs persistants (pas de cold start)
- ✅ 500h gratuites/mois ($5 de crédit)
- ✅ Déploiement automatique depuis GitHub
- ✅ Variables d'environnement faciles
- ✅ Logs en temps réel

---

## 📋 Étapes de Déploiement

### 1. Créer un compte Railway

1. Aller sur https://railway.app
2. Cliquer sur **"Start a New Project"**
3. Se connecter avec GitHub
4. Autoriser Railway à accéder à vos repos

### 2. Créer un nouveau projet

1. Cliquer sur **"New Project"**
2. Sélectionner **"Deploy from GitHub repo"**
3. Choisir le repo **`Louistatch/fedeactiva`**
4. Railway détecte automatiquement le backend

### 3. Configurer les variables d'environnement

Dans Railway, aller dans **Variables** et ajouter :

```bash
# Base de données Supabase
DB_HOST=db.hpcgbpgqivachzawygld.supabase.co
DB_PORT=5432
DB_USERNAME=postgres.hpcgbpgqivachzawygld
DB_PASSWORD=3991L@uis1993
DB_DATABASE=postgres
DB_SSL=true

# Supabase
SUPABASE_URL=https://hpcgbpgqivachzawygld.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwY2dicGdxaXZhY2h6YXd5Z2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODI3NzAsImV4cCI6MjA2MTc1ODc3MH0.sb_publishable_8B8pSvWBdixVjMME8P6TOw_jWZwL0iysb
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwY2dicGdxaXZhY2h6YXd5Z2xkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjE4Mjc3MCwiZXhwIjoyMDYxNzU4NzcwfQ.sb_secret_fdfNM9rktgjbdOmM6Sh9Dw_Gge5dANF0D8284B6-B47A-461A-950C-FBAC077BA3DE

# JWT
JWT_SECRET=fedeactiva-super-secret-jwt-key-production-2024
JWT_EXPIRES_IN=7d

# CORS (URL du frontend Vercel)
CORS_ORIGINS=https://fedeactiva-frontend.vercel.app,http://localhost:5173

# Node
NODE_ENV=production
PORT=3000
```

### 4. Configurer le déploiement

Railway détecte automatiquement `package.json` et utilise :
- **Build Command** : `npm run build`
- **Start Command** : `npm run start:prod`

Si ce n'est pas le cas, aller dans **Settings** > **Deploy** et configurer :

```bash
Build Command: npm run build
Start Command: npm run start:prod
Root Directory: backend
```

### 5. Déployer

1. Railway démarre automatiquement le déploiement
2. Attendre 2-3 minutes (installation + build + démarrage)
3. Une fois déployé, Railway génère une URL : `https://fedeactiva-production.up.railway.app`

### 6. Tester l'API

```bash
# Health check
curl https://fedeactiva-production.up.railway.app/api/v1/health

# Swagger docs
https://fedeactiva-production.up.railway.app/api/docs
```

---

## 🔄 Déploiement Automatique

Railway redéploie automatiquement à chaque push sur `main` :

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Railway détecte le push et redéploie en 2-3 minutes.

---

## 📊 Monitoring

Dans Railway :
- **Logs** : Voir les logs en temps réel
- **Metrics** : CPU, RAM, Network
- **Deployments** : Historique des déploiements

---

## 💰 Coûts

- **Plan Gratuit** : $5 de crédit/mois = ~500h d'exécution
- Si dépassement : $0.000231/GB-hour RAM + $0.000463/vCPU-hour

Pour un petit projet : **gratuit pendant plusieurs mois**

---

## 🔧 Alternative : Render

Si Railway ne fonctionne pas, essayer **Render** :

1. https://render.com
2. New > Web Service
3. Connect GitHub repo
4. Build Command : `cd backend && npm install && npm run build`
5. Start Command : `cd backend && npm run start:prod`
6. Ajouter les mêmes variables d'environnement

---

## ✅ Prochaines Étapes

Une fois le backend déployé sur Railway :

1. Copier l'URL Railway (ex: `https://fedeactiva-production.up.railway.app`)
2. Mettre à jour la variable `VITE_API_URL` dans Vercel (frontend)
3. Redéployer le frontend sur Vercel
4. Tester l'authentification

---

## 🆘 Dépannage

### Erreur de connexion base de données

Vérifier que `DB_SSL=true` est bien configuré dans Railway.

### Timeout au démarrage

Augmenter le timeout dans Railway Settings > Deploy > Health Check Timeout à 60 secondes.

### Port incorrect

Railway injecte automatiquement la variable `PORT`. NestJS l'utilise via `process.env.PORT`.

---

**Note** : Vercel reste utilisé pour le frontend uniquement. Le backend tourne sur Railway.
