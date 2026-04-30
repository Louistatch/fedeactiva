# 🔐 Système d'Authentification FedéActiva

## Vue d'ensemble

Le système d'authentification est maintenant **unifié** et détecte automatiquement le type d'utilisateur.

## 🎯 Types d'Utilisateurs

### 1. **Super Admin**
- Accès complet à toute la plateforme
- Gère toutes les fédérations
- Email: `admin@fedeactiva.tg`
- Mot de passe: À définir lors du seed

### 2. **Admin Fédération**
- Gère une fédération spécifique
- Crée et gère les packs
- Voit les commandes de sa fédération
- Email: `admin@federation.tg`

### 3. **Producteur**
- Achète des packs documentaires
- Télécharge ses documents
- Identifiant: Numéro de téléphone
- Exemple: `+228 90 12 34 56`

## 🔑 Endpoints API

### Login Unifié
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@fedeactiva.tg",
  "password": "votre_mot_de_passe"
}
```

**Réponse:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@fedeactiva.tg",
    "nom": "ADMIN",
    "prenom": "Super",
    "role": "super_admin"
  }
}
```

### Inscription (Producteur)
```http
POST /api/auth/register
Content-Type: application/json

{
  "nom": "AMETSITSI",
  "prenom": "Koffi",
  "telephone": "+228 90 12 34 56",
  "email": "koffi@email.tg",
  "password": "password123",
  "federation_id": "uuid-federation"
}
```

### Utilisateur Connecté
```http
GET /api/auth/me
Authorization: Bearer {accessToken}
```

### Déconnexion
```http
POST /api/auth/logout
Authorization: Bearer {accessToken}
```

## 🔄 Détection Automatique

Le système essaie dans cet ordre:

1. **Super Admin** (email)
2. **Admin Fédération** (email)
3. **Producteur** (téléphone)

Si aucun ne correspond → Erreur "Identifiants invalides"

## 💻 Utilisation Frontend

```typescript
import api from './services/api';

// Login
const response = await api.login('admin@fedeactiva.tg', 'password');
console.log(response.user.role); // 'super_admin'

// Récupérer l'utilisateur connecté
const user = await api.getCurrentUser();

// Déconnexion
await api.logout();
```

## 🔒 Protection des Routes

### Backend (NestJS)
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
async protectedRoute(@Req() req) {
  return req.user; // Utilisateur authentifié
}
```

### Frontend (React)
```tsx
<ProtectedRoute allowedRoles={['super_admin']}>
  <SuperAdminDashboard />
</ProtectedRoute>
```

## 🎨 Rôles et Permissions

| Rôle | Accès |
|------|-------|
| `super_admin` | Tout |
| `admin_federation` | Sa fédération uniquement |
| `producteur` | Ses commandes uniquement |

## 🧪 Tester l'Authentification

### 1. Créer un Super Admin
```sql
INSERT INTO super_admin (id, email, mot_de_passe_hash, nom, prenom, actif)
VALUES (
  gen_random_uuid(),
  'admin@fedeactiva.tg',
  '$2b$12$...', -- Hash de 'password123'
  'ADMIN',
  'Super',
  true
);
```

### 2. Tester avec cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fedeactiva.tg","password":"password123"}'

# Utiliser le token
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer {accessToken}"
```

### 3. Tester dans le Frontend
1. Allez sur `/login`
2. Entrez vos identifiants
3. Vous serez redirigé selon votre rôle:
   - Super Admin → `/super-admin`
   - Admin Fédération → `/federation-admin`
   - Producteur → `/` (portail public)

## 🔐 Sécurité

- ✅ Mots de passe hashés avec bcrypt (12 rounds)
- ✅ JWT avec expiration (7 jours par défaut)
- ✅ Tokens stockés dans localStorage
- ✅ Validation automatique des tokens
- ✅ Déconnexion automatique si token invalide
- ✅ CORS configuré
- ✅ Protection CSRF

## 📝 Variables d'Environnement

### Backend
```env
JWT_SECRET=fedeactiva-super-secret-jwt-key-production-2024
JWT_EXPIRES_IN=7d
```

### Frontend
```env
VITE_API_URL=https://votre-backend.vercel.app/api
```

## 🐛 Dépannage

### "Identifiants invalides"
- Vérifiez que l'utilisateur existe dans la base de données
- Vérifiez que le mot de passe est correct
- Vérifiez que l'utilisateur est actif (`actif = true`)

### "Unauthorized" sur /auth/me
- Le token JWT est expiré ou invalide
- Le token n'est pas envoyé dans le header Authorization
- L'utilisateur n'existe plus dans la base de données

### Redirection incorrecte après login
- Vérifiez le rôle de l'utilisateur dans la réponse
- Vérifiez les routes protégées dans `App.tsx`
- Vérifiez le `ProtectedRoute` component

## 🚀 Prochaines Étapes

1. ✅ Système d'authentification unifié
2. ⏳ Refresh tokens
3. ⏳ Authentification à deux facteurs (2FA)
4. ⏳ Réinitialisation de mot de passe
5. ⏳ Vérification d'email
6. ⏳ Sessions multiples
7. ⏳ Historique de connexion

---

**Dernière mise à jour:** 30 avril 2026
