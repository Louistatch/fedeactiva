// Entity Types
export interface Federation {
  id: string;
  nom: string;
  slug: string;
  logo_url?: string;
  description?: string;
  site_web?: string;
  email_contact: string;
  telephone_contact: string;
  adresse_postale?: string;
  couleur_primaire: string;
  couleur_secondaire: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Culture {
  id: string;
  nom: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Canton {
  id: string;
  nom: string;
  code: string;
  region: string;
  coordinates?: string; // GeoJSON coordinates stored as string
  created_at: Date;
  updated_at: Date;
}

export interface Pack {
  id: string;
  federation_id: string;
  culture_id: string;
  canton_id: string;
  federation?: Federation;
  culture?: Culture;
  canton?: Canton;
  titre: string;
  description: string;
  prixHT: number;
  tva_rate: number;
  prixTTC: number;
  fichier_excel_template: string;
  fichier_word_template: string;
  fichier_excel_generated?: string;
  fichier_word_generated?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  federation_id?: string;
  federation?: Federation;
  telephone?: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export type UserRole = 'super_admin' | 'admin_federation' | 'producteur';

export interface Order {
  id: string;
  pack_id: string;
  pack?: Pack;
  user_id?: string;
  user?: User;
  federation_id: string;
  federation?: Federation;
  culture?: Culture;
  canton?: Canton;
  numero: string;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  statut: OrderStatus;
  email_client: string;
  nom_client: string;
  telephone_client?: string;
  entreprise_client?: string;
  payment_intent_id?: string;
  payment_provider?: PaymentProvider;
  payment_status?: PaymentStatus;
  mode_paiement?: PaymentMethod;
  fichier_excel?: string;
  fichier_word?: string;
  documents_downloaded: boolean;
  documents_downloaded_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentProvider = 'fedapay' | 'cinetpay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'orange_money' | 'tmoney' | 'card' | 'bank_transfer';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  data?: Record<string, any>;
  created_at: Date;
}

export type NotificationType = 
  | 'order_created'
  | 'payment_success'
  | 'payment_failed'
  | 'document_ready'
  | 'new_user_registered';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Widget Types
export interface WidgetConfig {
  federation: string;
  theme?: 'light' | 'dark';
  primaryColor?: string;
  secondaryColor?: string;
  language?: 'fr' | 'en';
}

export interface WidgetMessage {
  type: WidgetMessageType;
  payload?: any;
}

export type WidgetMessageType =
  | 'ready'
  | 'error'
  | 'purchase_success'
  | 'purchase_error'
  | 'document_ready'
  | 'get_config'
  | 'set_config';

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nom: string;
  prenom: string;
  telephone?: string;
  federation_id?: string;
}

export interface OrderFormData {
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  entreprise?: string;
}

// Statistics Types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  ordersByStatus: Record<OrderStatus, number>;
  topCultures: { culture: string; count: number }[];
  recentOrders: Order[];
}

export interface FederationStats extends DashboardStats {
  federation: Federation;
  totalPacks: number;
  activePacks: number;
}

// Additional utility types
export interface Region {
  id: number;
  nom: string;
}

export interface Prefecture {
  id: number;
  nom: string;
  region_id: number;
}

export interface DocumentModel {
  id: string;
  federation_id: string;
  culture_id: string;
  canton_id: string;
  type_document: 'excel' | 'word';
  fichier_nom: string;
  fichier_path: string;
  fichier_size?: number;
  version: number;
  actif: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DownloadToken {
  id: string;
  ligne_commande_id: string;
  token: string;
  expire_at: Date;
  created_at: Date;
}
