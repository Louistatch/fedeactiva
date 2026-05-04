import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  Federation,
  Culture,
  Canton,
  Pack,
  Order,
  User,
  DashboardStats,
  FederationStats,
} from '../types';

// Détecte automatiquement l'URL selon l'environnement
const getApiUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && !envUrl.includes('TON-BACKEND')) return envUrl;
  // En production sur Vercel, utilise le même domaine
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `${window.location.origin}/api/v1`;
  }
  return 'http://localhost:3000/api/v1';
};

const API_BASE_URL = getApiUrl();

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', { email, password });
    this.setToken(response.data.accessToken);
    return response.data;
  }

  async register(data: {
    nom: string;
    prenom: string;
    telephone: string;
    email?: string;
    password: string;
    federation_id?: string;
  }): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    this.setToken(response.data.accessToken);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
    }
    this.clearToken();
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>('/auth/me');
    return response.data.data || response.data as any;
  }

  // Federation endpoints
  async getFederations(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Federation>> {
    const response = await this.api.get<PaginatedResponse<Federation>>('/federations', { params });
    return response.data;
  }

  async getFederation(id: string): Promise<Federation> {
    const response = await this.api.get<ApiResponse<Federation>>(`/federations/${id}`);
    return response.data.data;
  }

  async getFederationBySlug(slug: string): Promise<Federation> {
    const response = await this.api.get<ApiResponse<Federation>>(`/federations/slug/${slug}`);
    return response.data.data;
  }

  async createFederation(data: Partial<Federation>): Promise<Federation> {
    const response = await this.api.post<ApiResponse<Federation>>('/federations', data);
    return response.data.data;
  }

  async updateFederation(id: string, data: Partial<Federation>): Promise<Federation> {
    const response = await this.api.patch<ApiResponse<Federation>>(`/federations/${id}`, data);
    return response.data.data;
  }

  async deleteFederation(id: string): Promise<void> {
    await this.api.delete(`/federations/${id}`);
  }

  // Culture endpoints
  async getCultures(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Culture>> {
    const response = await this.api.get<PaginatedResponse<Culture>>('/cultures', { params });
    return response.data;
  }

  async getCulture(id: string): Promise<Culture> {
    const response = await this.api.get<ApiResponse<Culture>>(`/cultures/${id}`);
    return response.data.data;
  }

  async createCulture(data: Partial<Culture>): Promise<Culture> {
    const response = await this.api.post<ApiResponse<Culture>>('/cultures', data);
    return response.data.data;
  }

  async updateCulture(id: string, data: Partial<Culture>): Promise<Culture> {
    const response = await this.api.patch<ApiResponse<Culture>>(`/cultures/${id}`, data);
    return response.data.data;
  }

  async deleteCulture(id: string): Promise<void> {
    await this.api.delete(`/cultures/${id}`);
  }

  // Canton endpoints
  async getCantons(params?: {
    page?: number;
    limit?: number;
    search?: string;
    region?: string;
  }): Promise<PaginatedResponse<Canton>> {
    const response = await this.api.get<PaginatedResponse<Canton>>('/cantons', { params });
    return response.data;
  }

  async getCanton(id: string): Promise<Canton> {
    const response = await this.api.get<ApiResponse<Canton>>(`/cantons/${id}`);
    return response.data.data;
  }

  async getCantonByCoordinates(lat: number, lng: number): Promise<Canton | null> {
    const response = await this.api.get<ApiResponse<Canton | null>>(`/cantons/nearest`, {
      params: { lat, lng },
    });
    return response.data.data;
  }

  async createCanton(data: Partial<Canton>): Promise<Canton> {
    const response = await this.api.post<ApiResponse<Canton>>('/cantons', data);
    return response.data.data;
  }

  async updateCanton(id: string, data: Partial<Canton>): Promise<Canton> {
    const response = await this.api.patch<ApiResponse<Canton>>(`/cantons/${id}`, data);
    return response.data.data;
  }

  // Pack endpoints
  async getPacks(params?: {
    page?: number;
    limit?: number;
    federation_id?: string;
    culture_id?: string;
    canton_id?: string;
    search?: string;
  }): Promise<PaginatedResponse<Pack>> {
    const response = await this.api.get<PaginatedResponse<Pack>>('/packs', { params });
    return response.data;
  }

  async getPack(id: string): Promise<Pack> {
    const response = await this.api.get<ApiResponse<Pack>>(`/packs/${id}`);
    return response.data.data;
  }

  async getPackByFilters(federationSlug: string, cultureSlug: string, cantonCode: string): Promise<Pack | null> {
    const response = await this.api.get<ApiResponse<Pack | null>>(`/packs/filters`, {
      params: { federation_slug: federationSlug, culture_slug: cultureSlug, canton_code: cantonCode },
    });
    return response.data.data;
  }

  async createPack(data: Partial<Pack>): Promise<Pack> {
    const response = await this.api.post<ApiResponse<Pack>>('/packs', data);
    return response.data.data;
  }

  async updatePack(id: string, data: Partial<Pack>): Promise<Pack> {
    const response = await this.api.patch<ApiResponse<Pack>>(`/packs/${id}`, data);
    return response.data.data;
  }

  async deletePack(id: string): Promise<void> {
    await this.api.delete(`/packs/${id}`);
  }

  async uploadPackTemplates(id: string, files: { excel?: File; word?: File }): Promise<Pack> {
    const formData = new FormData();
    if (files.excel) formData.append('excel', files.excel);
    if (files.word) formData.append('word', files.word);

    const response = await this.api.post<ApiResponse<Pack>>(`/packs/${id}/templates`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  // Order endpoints
  async getOrders(params?: {
    page?: number;
    limit?: number;
    federation_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<Order>> {
    const response = await this.api.get<PaginatedResponse<Order>>('/orders', { params });
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  }

  async createOrder(data: {
    pack_id: string;
    email: string;
    nom: string;
    prenom: string;
    telephone?: string;
    entreprise?: string;
  }): Promise<Order> {
    const response = await this.api.post<ApiResponse<Order>>('/orders', data);
    return response.data.data;
  }

  async cancelOrder(id: string): Promise<Order> {
    const response = await this.api.post<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return response.data.data;
  }

  async refundOrder(id: string): Promise<Order> {
    const response = await this.api.post<ApiResponse<Order>>(`/orders/${id}/refund`);
    return response.data.data;
  }

  async downloadDocuments(orderId: string): Promise<Blob> {
    const response = await this.api.get(`/orders/${orderId}/documents/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Payment endpoints
  async initiatePayment(orderId: string, provider: 'fedapay' | 'cinetpay', method: string): Promise<{
    payment_url: string;
    payment_intent_id: string;
  }> {
    const response = await this.api.post<ApiResponse<{
      payment_url: string;
      payment_intent_id: string;
    }>>(`/payments/initiate`, {
      order_id: orderId,
      provider,
      method,
    });
    return response.data.data;
  }

  async verifyPayment(paymentIntentId: string): Promise<{
    status: string;
    order: Order;
  }> {
    const response = await this.api.post<ApiResponse<{
      status: string;
      order: Order;
    }>>(`/payments/verify`, {
      payment_intent_id: paymentIntentId,
    });
    return response.data.data;
  }

  // Dashboard endpoints
  async getSuperAdminStats(): Promise<DashboardStats> {
    const response = await this.api.get<ApiResponse<DashboardStats>>('/dashboard/super-admin');
    return response.data.data;
  }

  async getFederationStats(federationId: string): Promise<FederationStats> {
    const response = await this.api.get<ApiResponse<FederationStats>>(`/dashboard/federation/${federationId}`);
    return response.data.data;
  }

  // User endpoints
  async getUsers(params?: {
    page?: number;
    limit?: number;
    federation_id?: string;
    role?: string;
  }): Promise<PaginatedResponse<User>> {
    const response = await this.api.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  }

  async createUser(data: Partial<User>): Promise<User> {
    const response = await this.api.post<ApiResponse<User>>('/users', data);
    return response.data.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await this.api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Storage endpoints
  async uploadFile(file: File, folder: string = 'general'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await this.api.post<ApiResponse<{ url: string }>>('/storage/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  async deleteFile(url: string): Promise<void> {
    await this.api.delete('/storage/delete', { data: { url } });
  }
}

export const api = new ApiService();
export default api;
