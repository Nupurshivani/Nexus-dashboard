import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-600/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent-cyan/20 to-transparent rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Grid Pattern Overlay -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

      <!-- Login Card -->
      <div class="w-full max-w-md relative z-10 animate-fade-in-up">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 mb-4">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
              <defs>
                <linearGradient id="login-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#8b5cf6"/>
                  <stop offset="100%" style="stop-color:#06b6d4"/>
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="8" fill="url(#login-logo-grad)"/>
              <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gradient mb-2">Nexus Admin</h1>
          <p class="text-gray-400">Sign in to access your dashboard</p>
        </div>

        <!-- Login Form Card -->
        <div class="card-glass p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <!-- Error Message -->
          <div 
            *ngIf="errorMessage"
            class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-fade-in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p class="text-sm text-red-400">{{ errorMessage }}</p>
          </div>

          <form (ngSubmit)="login()">
            <!-- Email Input -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <input 
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="admin@dashboard.com"
                  required
                  class="w-full pl-12 pr-4 py-3.5 bg-dark-surface border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  (input)="clearError()"
                >
              </div>
            </div>

            <!-- Password Input -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input 
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  class="w-full pl-12 pr-12 py-3.5 bg-dark-surface border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  (input)="clearError()"
                >
                <button 
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between mb-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-600 bg-dark-surface text-primary-500 focus:ring-primary-500 focus:ring-offset-0">
                <span class="text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" class="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <!-- Login Button -->
            <button 
              type="submit" 
              [disabled]="isSubmitting"
              class="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/30 hover:from-primary-500 hover:to-primary-600 hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span *ngIf="!isSubmitting">Sign In</span>
              <span *ngIf="isSubmitting" class="flex items-center gap-2">
                <svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-white/10"></div>
            <span class="text-sm text-gray-500">or continue with</span>
            <div class="flex-1 h-px bg-white/10"></div>
          </div>

          <!-- Social Login Buttons -->
          <div class="grid grid-cols-3 gap-3">
            <button class="flex items-center justify-center py-3 bg-dark-surface border border-white/10 rounded-xl hover:bg-dark-surface-elevated hover:border-white/15 transition-all">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button class="flex items-center justify-center py-3 bg-dark-surface border border-white/10 rounded-xl hover:bg-dark-surface-elevated hover:border-white/15 transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
            <button class="flex items-center justify-center py-3 bg-dark-surface border border-white/10 rounded-xl hover:bg-dark-surface-elevated hover:border-white/15 transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="#5865F2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-dark-surface/50 border border-white/5 rounded-xl backdrop-blur-sm">
          <p class="text-xs text-gray-500 text-center mb-2">Demo Credentials</p>
          <div class="flex items-center justify-center gap-4 text-sm">
            <span class="text-gray-400">Email: <span class="text-primary-400 font-mono">admin&#64;dashboard.com</span></span>
            <span class="text-gray-400">Password: <span class="text-primary-400 font-mono">admin123</span></span>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-xs text-gray-600 mt-6">
          © 2025 Nexus Admin. Nupur Shivani
        </p>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-fade-in-up {
      animation: fade-in-up 0.6s ease-out;
    }

    .text-gradient {
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .card-glass {
      background: rgba(18, 18, 26, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;
  showPassword = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Redirect if already logged in
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    if (this.isSubmitting) return;

    this.errorMessage = '';
    this.isSubmitting = true;

    this.http.post<any>('/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          if (res.refreshToken) {
            localStorage.setItem('refreshToken', res.refreshToken);
          }
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.msg || 'Invalid email or password';
      }
    });
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
