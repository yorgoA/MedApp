import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'medapp_token';
  private readonly USER_KEY = 'medapp_user';

  private userSignal = signal<LoginResponse | null>(this.loadStoredUser());
  user = this.userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.userSignal());
  isDoctor = computed(() => this.userSignal()?.role === 'DOCTOR');
  isPatient = computed(() => this.userSignal()?.role === 'PATIENT');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse | null> {
    return this.http.post<LoginResponse>(`${API_URL}/login`, credentials).pipe(
      tap((res) => {
        this.userSignal.set(res);
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res));
      }),
      catchError(() => of(null))
    );
  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private loadStoredUser(): LoginResponse | null {
    const stored = localStorage.getItem(this.USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as LoginResponse;
    } catch {
      return null;
    }
  }
}
