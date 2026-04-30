# 🚀 Guide de Déploiement - FedeActiva

## ⚠️ IMPORTANT : Architecture de Déploiement

**NestJS ne fonctionne PAS bien sur Vercel** (fonctions serverless). Voici l'architecture recommandée :

- **Backend (NestJS)** → **Railway** (gratuit, conteneurs persistants) ✅
- **Frontend (React)** → **Vercel** (gratuit, optimisé pour React) ✅

---

## 🚂 PARTIE 1 : Déployer le Backend sur Railway

### Pourquoi Railway ?

- ✅ Conteneurs Node.js persistants (pas de cold start)
- ✅ 500h gratuites/mois ($5 de crédit)
- ✅ Parfait pour NestJS + TypeORM + PostgreSQL
- ✅ Déploiement automatique depuis GitHub
- ✅ Logs en temps réel

### Étape 1 : Créer un compte Railway

1. Allez sur https://railway.app
2. Cliquez sur **"Start a New Project"**
3. Connectez-vous avec GitHub
4. Autorisez Railway à accéder à vos repos

### Étape 2 : Créer le projet Backend

1. Cliquez sur **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Choisissez le repo **`Louistatch/fedeactiva`**
4. Railway détecte automatiquement le backend

### Étape 3 : Configurer le Root Directory

1. Allez dans **Settings** → **Service Settings**
2. **Root Directory** : `backend`
3. **Build Command** : `npm run build`
4. **Start Command** : `npm run start:prod`

### Étape 4 : Variables d'environnement Backend

Dans Railway, allez dans **Variables** et ajoutez :

```env
DB_HOST=db.hpcgbpgqivachzawygld.supabase.co
DB_PORT=5432
DB_USERNAME=postgres.hpcgbpgqivachzawygld
DB_PASSWORD=3991L@uis1993
DB_DATABASE=postgres
DB_SSL=true
SUPABASE_URL=https://hpcgbpgqivachzawygld.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwY2dicGdxaXZhY2h6YXd5Z2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODI3NzAsImV4cCI6MjA2MTc1ODc3MH0.sb_publishable_8B8pSvWBdixVjMME8P6TOw_jWZwL0iysb
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwY2dicGdxaXZhY2h6YXd5Z2xkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjE4Mjc3MCwiZXhwIjoyMDYxNzU4NzcwfQ.sb_secret_fdfNM9rktgjbdOmM6Sh9Dw_Gge5dANF0D8284B6-B47A-461A-950C-FBAC077BA3DE
JWT_SECRET=fedeactiva-super-secret-jwt-key-production-2024
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

### Étape 5 : Déployer le Backend

1. Railway démarre automatiquement le déploiement
2. Attendez 2-3 minutes
3. Notez l'URL générée (ex: `https://fedeactiva-production.up.railway.app`)

### Étape 6 : Tester l'API

```bash
# Health check
curl https://fedeactiva-production.up.railway.app/api/v1/health

# Swagger docs
https://fedeactiva-production.up.railway.app/api/docs
```

---

## 🎨 PARTIE 2 : Déployer le Frontend sur Vercel

### Étape 1 : Créer le projet Frontend

1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub
3. Cliquez sur **"Add New..."** → **"Project"**
4. Sélectionnez le repository **`fedeactiva`**
5. Cliquez sur **"Import"**

### Étape 2 : Configuration du Frontend

**Root Directory:**
```
frontend
```

**Framework Preset:**
```
Vite
```

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

### Étape 3 : Variables d'environnement Frontend

⚠️ **IMPORTANT** : Remplacez `https://fedeactiva-production.up.railway.app` par l'URL réelle de votre backend Railway

```env
VITE_API_URL=https://fedeactiva-production.up.railway.app
VITE_APP_NAME=FedeActiva
VITE_SUPABASE_URL=https://hpcgbpgqivachzawygld.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwY2dicGdxaXZhY2h6YXd5Z2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODI3NzAsImV4cCI6MjA2MTc1ODc3MH0.sb_publishable_8B8pSvWBdixVjMME8P6TOw_jWZwL0iysb
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_WIDGET_VERSION=2.0.0
```

### Étape 4 : Déployer le Frontend

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. Votre application est en ligne ! 🎉

---

## ✅ Vérification

Après le déploiement, vous aurez :

- **Backend API** : `https://fedeactiva-production.up.railway.app`
- **Frontend** : `https://fedeactiva.vercel.app`

### Tester l'API
```bash
curl https://fedeactiva-production.up.railway.app/api/v1/health
```

### Tester le Frontend
Ouvrez `https://fedeactiva.vercel.app` dans votre navigateur

---

## 🔄 Déploiements automatiques

Chaque fois que vous poussez du code sur GitHub :
- **Backend (Railway)** : Se redéploie automatiquement
- **Frontend (Vercel)** : Se redéploie automatiquement

```bash
git add .
git commit -m "Update code"
git push origin main
```

---

## 🌐 Domaines personnalisés (Optionnel)

### Backend (Railway)
1. Allez dans **Settings** → **Networking**
2. Ajoutez votre domaine (ex: `api.fedeactiva.com`)
3. Configurez les DNS selon les instructions

### Frontend (Vercel)
1. Allez dans **Settings** → **Domains**
2. Ajoutez votre domaine (ex: `fedeactiva.com`)
3. Configurez les DNS selon les instructions

---

## 🆘 Problèmes courants

### Backend ne démarre pas sur Railway
- Vérifiez les logs dans Railway Dashboard
- Vérifiez que `Root Directory` = `backend`
- Vérifiez que toutes les variables d'environnement sont configurées
- Vérifiez que Supabase autorise les connexions depuis Railway

### Frontend ne se connecte pas au Backend
- Vérifiez que `VITE_API_URL` pointe vers l'URL Railway (pas Vercel)
- Vérifiez les CORS dans le backend (`main.ts`)
- Ouvrez la console du navigateur pour voir les erreurs

### Erreur de build Frontend
- Vérifiez que le `Root Directory` = `frontend`
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez les logs de build dans Vercel

---

## 💰 Coûts

### Railway (Backend)
- **Plan Gratuit** : $5 de crédit/mois = ~500h d'exécution
- Pour un petit projet : **gratuit pendant plusieurs mois**

### Vercel (Frontend)
- **Plan Hobby** : Gratuit pour toujours
- Bande passante illimitée
- 100 GB-hours d'exécution/mois

---

## 📊 Monitoring

### Railway (Backend)
- **Logs** : Voir les logs en temps réel
- **Metrics** : CPU, RAM, Network
- **Deployments** : Historique des déploiements

### Vercel (Frontend)
- **Analytics** : Voir le trafic
- **Logs** : Voir les erreurs en temps réel
- **Deployments** : Historique des déploiements

---

## 💡 Conseils

1. **Nommez vos projets clairement** :
   - Railway : `fedeactiva-backend`
   - Vercel : `fedeactiva-frontend`

2. **Utilisez les Preview Deployments** :
   - Créez une branche → Push → Preview automatique

3. **Configurez les notifications** :
   - Activez les alertes par email pour les erreurs

4. **Surveillez les crédits Railway** :
   - Vérifiez votre usage dans Railway Dashboard

---

## 🔧 Alternative : Render (si Railway ne fonctionne pas)

Si Railway ne fonctionne pas, essayez **Render** :

1. https://render.com
2. New > Web Service
3. Connect GitHub repo
4. **Root Directory** : `backend`
5. **Build Command** : `npm install && npm run build`
6. **Start Command** : `npm run start:prod`
7. Ajoutez les mêmes variables d'environnement

---

## 📚 Ressources

- [Documentation Railway](https://docs.railway.app)
- [Documentation Vercel](https://vercel.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/faq/serverless)
- [Vite sur Vercel](https://vercel.com/docs/frameworks/vite)

---

## 📝 Résumé

✅ **Backend** : Railway (conteneurs persistants pour NestJS)  
✅ **Frontend** : Vercel (optimisé pour React/Vite)  
✅ **Base de données** : Supabase (PostgreSQL managé)  
✅ **Déploiement** : Automatique depuis GitHub  
✅ **Coût** : Gratuit pour les deux services
