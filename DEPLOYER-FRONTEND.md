# 🚀 Déployer le Frontend sur Vercel

## 📋 Étapes Simples

### 1️⃣ Aller sur Vercel
1. Ouvrez votre navigateur et allez sur: **https://vercel.com/**
2. Connectez-vous avec votre compte GitHub

### 2️⃣ Créer un Nouveau Projet
1. Cliquez sur le bouton **"Add New..."** en haut à droite
2. Sélectionnez **"Project"**

### 3️⃣ Importer le Repository
1. Cherchez et sélectionnez: **`Louistatch/fedeactiva`**
2. Cliquez sur **"Import"**

### 4️⃣ Configurer le Projet Frontend

Remplissez les champs suivants:

**Project Name:**
```
fedeactiva-frontend
```

**Framework Preset:**
```
Vite
```

**Root Directory:**
```
frontend
```
⚠️ **TRÈS IMPORTANT**: Cliquez sur "Edit" à côté de "Root Directory" et tapez `frontend`

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

### 5️⃣ Ajouter les Variables d'Environnement

Cliquez sur **"Environment Variables"** et ajoutez:

**Variable 1:**
- **Name**: `VITE_API_URL`
- **Value**: `https://VOTRE-BACKEND-URL.vercel.app/api`
  
  ⚠️ **REMPLACEZ** `VOTRE-BACKEND-URL` par l'URL réelle de votre backend!

**Variable 2:**
- **Name**: `VITE_APP_NAME`
- **Value**: `FedeActiva`

**Variable 3:**
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://hpcgbpgqivachzawygld.supabase.co`

**Variable 4:**
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwY2dicGdxaXZhY2h6YXd5Z2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODI3NzAsImV4cCI6MjA2MTc1ODc3MH0.sb_publishable_8B8pSvWBdixVjMME8P6TOw_jWZwL0iysb`

**Variable 5:**
- **Name**: `VITE_ENABLE_ERROR_REPORTING`
- **Value**: `true`

**Variable 6:**
- **Name**: `VITE_WIDGET_VERSION`
- **Value**: `2.0.0`

### 6️⃣ Déployer!

1. Cliquez sur le bouton **"Deploy"**
2. Attendez 2-3 minutes que Vercel construise et déploie votre frontend
3. Une fois terminé, vous verrez un message de succès avec l'URL de votre site!

## 🎯 Après le Déploiement

Votre frontend sera accessible à une URL comme:
```
https://fedeactiva-frontend.vercel.app
```

Vous pourrez:
- ✅ Accéder à la page de login: `https://votre-frontend.vercel.app/login`
- ✅ Tester l'application complète
- ✅ Partager le lien avec d'autres utilisateurs

## 🔧 Si vous devez changer l'URL du Backend plus tard

1. Allez dans votre projet frontend sur Vercel
2. Cliquez sur **"Settings"**
3. Cliquez sur **"Environment Variables"**
4. Modifiez `VITE_API_URL` avec la nouvelle URL
5. Allez dans **"Deployments"**
6. Cliquez sur les 3 points (...) du dernier déploiement
7. Cliquez sur **"Redeploy"**

## 📝 Notes Importantes

- Le **Root Directory** doit être `frontend` (pas vide!)
- L'URL du backend doit se terminer par `/api`
- Chaque push sur GitHub redéploiera automatiquement

## ✅ Checklist

- [ ] Root Directory = `frontend`
- [ ] Framework Preset = `Vite`
- [ ] Variable `VITE_API_URL` configurée avec l'URL du backend
- [ ] Toutes les autres variables d'environnement ajoutées
- [ ] Déploiement lancé

Bonne chance! 🚀
