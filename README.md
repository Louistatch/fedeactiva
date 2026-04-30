# FedeActiva v2.0

Plateforme multi-tenant pour la gestion de packs documentaires agricoles.

## 🚀 Technologies

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données (Supabase)
- **JWT** - Authentification
- **Passport** - Stratégies d'authentification

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool
- **React Router** - Routing
- **TanStack Query** - Gestion d'état serveur
- **Axios** - Client HTTP
- **Tailwind CSS** - Framework CSS

## 📦 Structure du projet

```
fedeactiva/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── modules/  # Modules fonctionnels
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── frontend/         # Application React
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── contexts/
    │   └── types/
    └── package.json
```

## 🛠️ Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase (ou autre base PostgreSQL)

### Backend

```bash
cd backend
npm install
```

Créez un fichier `.env`:
```env
DB_HOST=your-supabase-host
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_DATABASE=postgres
DB_SSL=true

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

NODE_ENV=development
PORT=3000
```

Démarrez le serveur:
```bash
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
```

Créez un fichier `.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=FedeActiva
```

Démarrez l'application:
```bash
npm run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api (Swagger)

## 📚 Modules

### Backend
- **Auth** - Authentification et autorisation
- **Federation** - Gestion des fédérations
- **Culture** - Gestion des cultures agricoles
- **Canton** - Gestion des cantons
- **Pack** - Gestion des packs documentaires
- **Order** - Gestion des commandes
- **Payment** - Intégration paiements (FedaPay, CinetPay)
- **Document** - Génération de documents (Excel, Word)
- **User** - Gestion des utilisateurs
- **Notification** - Système de notifications
- **Storage** - Gestion des fichiers
- **Audit** - Logs d'audit

### Frontend
- **Public Portal** - Portail public
- **Login** - Authentification
- **Super Admin Dashboard** - Tableau de bord super admin
- **Federation Admin Dashboard** - Tableau de bord admin fédération
- **Embed Widget** - Widget intégrable

## 🔐 Rôles

- **super_admin** - Accès complet à la plateforme
- **federation_admin** - Gestion d'une fédération
- **producteur** - Utilisateur producteur

## 🚀 Déploiement

### Backend
```bash
npm run build
npm run start:prod
```

### Frontend
```bash
npm run build
# Les fichiers sont dans dist/
```

## 📝 License

MIT

## 👥 Auteurs

FedeActiva Team
