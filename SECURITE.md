# 🔒 Guide de Sécurité - FedeActiva

## ✅ Mesures de Sécurité Implémentées

### 1. Authentification et Autorisation

#### JWT Sécurisé
- ✅ Secret JWT obligatoire (minimum 32 caractères en production)
- ✅ Expiration des tokens (7 jours)
- ✅ Validation stricte du payload
- ✅ Guards JWT et Roles pour protéger les routes

#### Mots de Passe
- ✅ Hachage avec bcrypt (12 rounds)
- ✅ Validation de la force du mot de passe (min 8 caractères)
- ✅ Pas de stockage en clair

### 2. Rate Limiting

#### Protection contre Brute Force
- ✅ Rate limiting global: 10 requêtes/minute
- ✅ Rate limiting login: 5 tentatives/minute
- ✅ Rate limiting inscription: 3 tentatives/minute

### 3. Validation des Données

#### DTOs avec class-validator
- ✅ Validation des emails
- ✅ Validation des téléphones
- ✅ Validation des UUIDs
- ✅ Whitelist des propriétés

### 4. Sécurité HTTP

#### Headers de Sécurité (Helmet)
- ✅ Content-Security-Policy
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Strict-Transport-Security

#### CORS
- ✅ Origines configurables
- ✅ Credentials autorisés
- ✅ Méthodes HTTP limitées

### 5. Base de Données

#### TypeORM
- ✅ Requêtes paramétrées (protection SQL injection)
- ✅ SSL activé pour Supabase
- ✅ Synchronize désactivé en production

### 6. Monitoring

#### Health Checks
- ✅ `/health` - Status complet
- ✅ `/health/ready` - Readiness probe
- ✅ `/health/live` - Liveness probe

---

## ⚠️ Mesures à Implémenter

### 1. Validation Webhook FedaPay

**Priorité**: 🔴 CRITIQUE

```typescript
// backend/src/modules/payment/payment.service.ts
private validateSignature(payload: any, signature: string): boolean {
  const crypto = require('crypto');
  const secret = process.env.FEDAPAY_WEBHOOK_SECRET;
  
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hmac === signature;
}
```

### 2. Chiffrement des Données Sensibles

**Priorité**: 🟡 IMPORTANT

```typescript
import * as crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 3. Authentification à Deux Facteurs (2FA)

**Priorité**: 🟡 IMPORTANT

```bash
npm install speakeasy qrcode
```

```typescript
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

// Générer un secret 2FA
const secret = speakeasy.generateSecret({
  name: 'FedeActiva',
  issuer: 'FedeActiva',
});

// Générer QR code
const qrCode = await QRCode.toDataURL(secret.otpauth_url);

// Vérifier le token
const verified = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: userToken,
  window: 2,
});
```

### 4. Refresh Tokens

**Priorité**: 🟡 IMPORTANT

```typescript
// Générer access token (15 min) + refresh token (30 jours)
const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

// Stocker refresh token en base de données
await this.refreshTokenRepo.save({
  userId: user.id,
  token: refreshToken,
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
});
```

### 5. Audit Logging Complet

**Priorité**: 🟡 IMPORTANT

```typescript
// Logger toutes les actions sensibles
await this.auditService.log({
  userId: user.id,
  action: 'LOGIN',
  resource: 'AUTH',
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  metadata: { role: user.role },
});
```

### 6. Protection CSRF

**Priorité**: 🟢 MOYEN

```bash
npm install csurf
```

```typescript
import * as csurf from 'csurf';

app.use(csurf({ cookie: true }));
```

---

## 🔐 Variables d'Environnement Sécurisées

### Production (Railway)

1. Allez dans **Railway** → **Variables**
2. Ajoutez les variables **UNE PAR UNE** (ne pas copier-coller le fichier .env)
3. Utilisez des secrets forts:

```bash
# Générer un JWT secret fort
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Générer une clé de chiffrement
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Variables Requises

```env
# Base de données
DB_HOST=
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
DB_SSL=true

# JWT (CRITIQUE)
JWT_SECRET=<64-caractères-minimum>
JWT_EXPIRES_IN=15m

# Refresh Token
REFRESH_TOKEN_SECRET=<64-caractères-minimum>
REFRESH_TOKEN_EXPIRES_IN=30d

# Chiffrement
ENCRYPTION_KEY=<32-bytes-hex>

# FedaPay
FEDAPAY_PUBLIC_KEY=
FEDAPAY_SECRET_KEY=
FEDAPAY_WEBHOOK_SECRET=

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# CORS
CORS_ORIGINS=https://your-frontend.vercel.app

# Environment
NODE_ENV=production
```

---

## 🛡️ Checklist de Sécurité

### Avant le Déploiement

- [ ] `.env` ajouté à `.gitignore`
- [ ] `.env` supprimé du repo Git
- [ ] JWT_SECRET > 32 caractères
- [ ] Mots de passe hashés avec bcrypt
- [ ] Rate limiting activé
- [ ] CORS configuré strictement
- [ ] SSL activé pour la base de données
- [ ] Helmet activé
- [ ] Validation des DTOs complète
- [ ] Health checks implémentés

### Après le Déploiement

- [ ] Tester les endpoints avec des données invalides
- [ ] Tester le rate limiting (5 tentatives de login)
- [ ] Vérifier les logs d'erreur
- [ ] Tester la connexion base de données
- [ ] Vérifier les headers de sécurité (helmet)
- [ ] Tester CORS depuis le frontend
- [ ] Monitorer les performances
- [ ] Configurer les alertes (Sentry, DataDog)

### Maintenance Continue

- [ ] Mettre à jour les dépendances régulièrement
- [ ] Auditer les vulnérabilités (`npm audit`)
- [ ] Revoir les logs d'audit
- [ ] Tester les backups de base de données
- [ ] Renouveler les secrets tous les 90 jours
- [ ] Revoir les permissions des utilisateurs

---

## 🚨 Incidents de Sécurité

### En Cas de Fuite de Credentials

1. **Immédiatement**:
   - Révoquer tous les tokens JWT
   - Changer tous les secrets (JWT, DB, FedaPay)
   - Forcer la déconnexion de tous les utilisateurs
   - Analyser les logs pour détecter les accès non autorisés

2. **Dans les 24h**:
   - Notifier les utilisateurs affectés
   - Documenter l'incident
   - Implémenter des mesures correctives
   - Auditer le code pour trouver la source

3. **Prévention**:
   - Activer 2FA pour les admins
   - Implémenter la détection d'anomalies
   - Ajouter des alertes sur les actions sensibles

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

---

## 🆘 Support Sécurité

En cas de découverte de vulnérabilité:
- Email: security@fedeactiva.com
- Ne pas divulguer publiquement
- Fournir un POC (Proof of Concept)
- Délai de réponse: 48h
