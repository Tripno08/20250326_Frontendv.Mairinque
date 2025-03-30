import { createApiClient, post } from '@/utils/apiUtils';
import { AuthResponse, LoginCredentials, User } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const apiClient = createApiClient(API_URL);

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {
    // Recupera o usuário do localStorage ao inicializar
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>(apiClient, '/auth/login', credentials);
      
      // Salva o token e dados do usuário
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      this.currentUser = response.data.user;
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await post(apiClient, '/auth/logout');
    } finally {
      this.clearAuth();
    }
  }

  public async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>(apiClient, '/auth/refresh');
      localStorage.setItem('auth_token', response.data.token);
      return response.data;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUser && !!localStorage.getItem('auth_token');
  }

  public hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.currentUser = null;
  }
}

export const authService = AuthService.getInstance(); 