# 🚀 Guide de Déploiement Vercel - FedéActiva

## ✅ Problème Résolu
Le projet a été déplacé de `Downloads/package (3)/` vers `C:\Users\HP\Downloads\fedeactiva` pour éviter l'erreur des espaces dans le chemin.

## 📋 Étapes de Déploiement

### 1️⃣ Déployer le Backend

1. **Aller sur Vercel**: https://vercel.com/
2. **Cliquer sur "Add New Project"**
3. **Importer le repository**: `https://github.com/Louistatch/fedeactiva.git`
4. **Configurer le projet Backend**:
   - **Project Name**: `fedeactiva-backend`
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Ajouter les Variables d'Environnement** (très important!):
   ```
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
   API_PREFIX=api
   ```

6. **Cliquer sur "Deploy"**
7. **Noter l'URL du backend** (exemple: `https://fedeactiva-backend.vercel.app`)

### 2️⃣ Déployer le Frontend

1. **Retourner sur Vercel Dashboard**
2. **Cliquer sur "Add New Project"**
3. **Importer le même repository**: `https://github.com/Louistatch/fedeactiva.git`
4. **Configurer le projet Frontend**:
   - **Project Name**: `fedeactiva-frontend`
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Ajouter les Variables d'Environnement**:
   ```
   VITE_API_URL=https://fedeactiva-backend.vercel.app/api
   ```
   ⚠️ **IMPORTANT**: Remplacez `https://fedeactiva-backend.vercel.app` par l'URL réelle de votre backend déployé à l'étape 1.

6. **Cliquer sur "Deploy"**
7. **Votre application sera accessible** à l'URL fournie (exemple: `https://fedeactiva-frontend.vercel.app`)

## 🔧 Configuration des Fichiers

Les fichiers suivants ont été créés pour le déploiement:

### `backend/vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ]
}
```

### `backend/api/index.js`
Point d'entrée serverless pour NestJS.

### `frontend/vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 📝 Notes Importantes

1. **Deux projets séparés**: Backend et Frontend sont déployés comme deux projets Vercel distincts
2. **Variables d'environnement**: Assurez-vous de bien configurer toutes les variables d'environnement
3. **URL du Backend**: Mettez à jour `VITE_API_URL` dans le frontend avec l'URL réelle du backend
4. **Base de données**: Supabase est déjà configuré et prêt à l'emploi
5. **Redéploiement**: Chaque push sur la branche `main` déclenchera un redéploiement automatique

## 🎯 Prochaines Étapes

Après le déploiement:
1. Tester la connexion à la base de données
2. Vérifier que le frontend peut communiquer avec le backend
3. Tester la page de login
4. Configurer un domaine personnalisé (optionnel)

## 🆘 Dépannage

Si le déploiement échoue:
- Vérifiez les logs de build dans Vercel
- Assurez-vous que toutes les variables d'environnement sont correctement configurées
- Vérifiez que le Root Directory est bien défini (`backend` ou `frontend`)
- Vérifiez que le repository GitHub est à jour

## 📞 Support

En cas de problème, consultez:
- Documentation Vercel: https://vercel.com/docs
- Documentation NestJS: https://docs.nestjs.com
- Documentation Supabase: https://supabase.com/docs
