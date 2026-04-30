# FedeActiva Frontend

The frontend application for the FedeActiva multi-tenant SaaS platform, built with React and TypeScript.

## Project Structure

```
frontend/
├── public/                 # Static public assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── auth/          # Authentication components
│   │   │   └── ProtectedRoute.tsx
│   │   └── layout/        # Layout components
│   │       ├── Layout.tsx
│   │       └── Layout.css
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── FederationContext.tsx
│   ├── pages/              # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── public/        # Public-facing pages
│   │   ├── super-admin/   # Super Admin dashboard
│   │   └── federation-admin/ # Federation Admin dashboard
│   ├── services/           # API services
│   │   └── api.ts
│   ├── styles/            # Global styles
│   │   └── global.css
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## Applications

This monorepo contains three distinct React applications:

### 1. Public Portal
- **URL**: `/`
- **Purpose**: Public-facing website for browsing and purchasing document packs
- **Components**: `PublicPortal.tsx`, `PublicPortal.css`

### 2. Embeddable Widget
- **URL**: `/embed/:federationSlug`
- **Purpose**: Embeddable iframe widget for federation websites
- **Components**: `EmbedPage.tsx`, `EmbedPage.css`
- **Integration**: Use `widget/widget.js` for embedding

### 3. Super Admin Panel
- **URL**: `/super-admin/*`
- **Purpose**: Platform-wide administration
- **Access**: Super Admin users only
- **Components**: `Dashboard.tsx`, `Dashboard.css`

### 4. Federation Admin Panel
- **URL**: `/federation-admin/*`
- **Purpose**: Federation-specific management
- **Access**: Federation Admin users only
- **Components**: `Dashboard.tsx`, `Dashboard.css`

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create environment variables:
   ```bash
   cp .env.example .env
   ```

5. Edit `.env` with your configuration:
   ```
   VITE_API_URL=http://localhost:3000/api/v1
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Super Admin, Federation Admin, Producer)
- Protected routes with automatic redirect
- Token refresh handling

### State Management

- React Query for server state
- Context API for UI state (Auth, Federation theming)
- Local storage for token persistence

### Theming

Dynamic theming based on federation branding:

```typescript
// CSS Variables
--primary-color: #10B981;  // Configurable per federation
--secondary-color: #059669;
```

### API Integration

The `ApiService` class provides methods for:

- Authentication (`login`, `register`, `logout`)
- Federations CRUD
- Cultures CRUD
- Cantons CRUD
- Packs CRUD
- Orders management
- Payments integration
- Dashboard statistics

## Component Library

### Layout Components

- `Layout`: Admin panel layout with sidebar navigation
- `ProtectedRoute`: Route guard for authenticated routes

### Context Providers

- `AuthProvider`: Authentication state management
- `FederationProvider`: Federation theming and data

### UI Components

- Buttons (`.btn`, `.btn-primary`, `.btn-secondary`)
- Forms (`.input`, `.form-group`)
- Cards (`.card`, `.card-header`, `.card-body`)
- Badges (`.badge`, `.status-badge`)
- Alerts (`.alert`, `.alert-success`, `.alert-error`)

## Widget Integration

To embed the purchase widget on external websites:

```html
<!-- Add this script tag before closing </body> -->
<script src="https://widget.fedeactiva.tg/widget.js"></script>

<!-- Place this div where you want the widget -->
<div id="fedeactiva-purchase"
     data-federation="federation-slug"
     data-culture="culture-slug"
     data-canton="canton-code">
</div>
```

Or use the JavaScript API:

```javascript
FedeActiva.init({
  federation: 'federation-slug',
  theme: 'light', // or 'dark'
  primaryColor: '#10B981'
});
```

## API Configuration

Configure the API base URL in `.env`:

```bash
VITE_API_URL=https://api.fedeactiva.tg
```

## Payment Providers

The platform supports:

- **FedaPay**: `https://fedapay.com`
- **CinetPay**: `https://cinetpay.com`

Configure public keys in `.env`:

```bash
VITE_FEDAPAY_PUBLIC_KEY=your_key
VITE_CINETPAY_PUBLIC_KEY=your_key
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Proprietary - FedeActiva Platform
