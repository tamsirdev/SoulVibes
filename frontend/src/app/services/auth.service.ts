import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isSeller = computed(() => this.currentUser()?.role === 'seller');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUser();
  }

  private loadUser(): void {
    const tokens = localStorage.getItem('tokens');
    const user = localStorage.getItem('user');
    if (tokens && user) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('tokens', JSON.stringify(response.tokens));
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUser.set(response.user);
        })
      );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('tokens', JSON.stringify(response.tokens));
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUser.set(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      return JSON.parse(tokens).access;
    }
    return null;
  }

  refreshToken(): Observable<any> {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      const refresh = JSON.parse(tokens).refresh;
      return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh });
    }
    throw new Error('No refresh token');
  }
}
