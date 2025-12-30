import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'superadmin' | 'moderator';
    status: 'active' | 'inactive' | 'suspended' | 'pending';
    department?: string;
    avatar?: string | null;
    phone?: string;
    location?: { city?: string; country?: string };
    preferences?: { theme: string; notifications: boolean; language: string };
    lastLogin?: Date;
    createdAt?: Date;
    loginCount?: number;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    refreshToken?: string;
    user: User;
}

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    private tokenSubject = new BehaviorSubject<string | null>(null);

    currentUser$ = this.currentUserSubject.asObservable();
    isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadStoredAuth();
    }

    private loadStoredAuth(): void {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                this.tokenSubject.next(token);
                this.currentUserSubject.next(user);
            } catch {
                this.clearAuth();
            }
        }
    }

    private getHeaders(): HttpHeaders {
        const token = this.tokenSubject.value;
        return new HttpHeaders({
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        });
    }

    get token(): string | null {
        return this.tokenSubject.value;
    }

    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }

    get isAdmin(): boolean {
        const user = this.currentUser;
        return user ? ['admin', 'superadmin'].includes(user.role) : false;
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password })
            .pipe(
                tap(response => {
                    if (response.success && response.token) {
                        this.setAuth(response.token, response.user, response.refreshToken);
                    }
                }),
                catchError(error => {
                    console.error('Login error:', error);
                    return throwError(() => error);
                })
            );
    }

    register(userData: { name: string; email: string; password: string; role?: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
            .pipe(
                tap(response => {
                    if (response.success && response.token) {
                        this.setAuth(response.token, response.user, response.refreshToken);
                    }
                })
            );
    }

    logout(): void {
        const token = this.token;
        if (token) {
            this.http.post(`${this.API_URL}/auth/logout`, {}, {
                headers: this.getHeaders()
            }).subscribe({
                complete: () => this.performLogout(),
                error: () => this.performLogout()
            });
        } else {
            this.performLogout();
        }
    }

    private performLogout(): void {
        this.clearAuth();
        this.router.navigate(['/login']);
    }

    private setAuth(token: string, user: User, refreshToken?: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
    }

    private clearAuth(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        this.tokenSubject.next(null);
        this.currentUserSubject.next(null);
    }

    refreshToken(): Observable<{ success: boolean; token: string }> {
        const refreshToken = localStorage.getItem('refreshToken');
        return this.http.post<{ success: boolean; token: string }>(`${this.API_URL}/auth/refresh`, { refreshToken })
            .pipe(
                tap(response => {
                    if (response.success && response.token) {
                        localStorage.setItem('token', response.token);
                        this.tokenSubject.next(response.token);
                    }
                })
            );
    }

    getCurrentUser(): Observable<{ success: boolean; user: User }> {
        return this.http.get<{ success: boolean; user: User }>(`${this.API_URL}/auth/me`, {
            headers: this.getHeaders()
        }).pipe(
            tap(response => {
                if (response.success) {
                    this.currentUserSubject.next(response.user);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
            })
        );
    }

    updateProfile(data: Partial<User>): Observable<{ success: boolean; user: User }> {
        return this.http.put<{ success: boolean; user: User }>(`${this.API_URL}/auth/profile`, data, {
            headers: this.getHeaders()
        }).pipe(
            tap(response => {
                if (response.success) {
                    this.currentUserSubject.next(response.user);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
            })
        );
    }
}
