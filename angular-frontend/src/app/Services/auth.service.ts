import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, map } from 'rxjs';

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  phone: string;
  isGuest: boolean;
  token?: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
}

export interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5158/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * Login user with credentials
   */
  login(username: string, password: string): Observable<boolean> {
    const loginDTO = { userName: username, password: password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, loginDTO)
      .pipe(
        tap((response: LoginResponse) => {
          const user: AuthUser = {
            id: this.extractUserIdFromToken(response.token),
            name: username,
            email: '',
            phone: '',
            isGuest: false,
            token: response.token
          };
          
          // Store token and user
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('tokenExpiration', response.expiration);
          localStorage.setItem('authUser', JSON.stringify(user));
          
          this.currentUserSubject.next(user);
          this.tokenSubject.next(response.token);
          this.isAuthenticatedSubject.next(true);
        }),
        map(() => true),
        catchError(error => {
          console.error('Login failed:', error);
          throw error;
        })
      );
  }

  /**
   * Register new user
   */
  register(username: string, email: string, password: string): Observable<RegisterResponse> {
    const registerDTO = { 
      userName: username, 
      email: email, 
      password: password 
    };
    
    return this.http.post<RegisterResponse>(`${this.apiUrl}/Register`, registerDTO)
      .pipe(
        tap((response: RegisterResponse) => {
          console.log('User registered successfully:', response);
        }),
        catchError(error => {
          console.error('Registration failed:', error);
          throw error;
        })
      );
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Load user from storage
   */
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const user: AuthUser = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Update user
   */
  updateUser(user: AuthUser): void {
    localStorage.setItem('authUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Get JWT token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return true;
    return new Date(expiration) < new Date();
  }

  /**
   * Extract user ID from JWT token
   */
  private extractUserIdFromToken(token: string): string | undefined {
    try {
      const payload = this.parseJwt(token);
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload['sub'];
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return undefined;
    }
  }

  /**
   * Parse JWT token
   */
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }
}
