import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

interface NavItem {
    label: string;
    icon: string;
    route: string;
    badge?: number;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <aside 
      class="fixed left-0 top-0 h-screen bg-dark-surface border-r border-white/5 flex flex-col z-40 transition-all duration-300"
      [class.w-72]="!isCollapsed"
      [class.w-20]="isCollapsed"
    >
      <!-- Logo Section -->
      <div class="flex items-center justify-between p-6 border-b border-white/5">
        <a [routerLink]="['/dashboard']" class="flex items-center gap-3 no-underline">
          <div class="w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#8b5cf6"/>
                  <stop offset="100%" style="stop-color:#06b6d4"/>
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="8" fill="url(#logo-grad)"/>
              <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span 
            *ngIf="!isCollapsed"
            class="text-xl font-extrabold bg-gradient-to-r from-primary-400 to-accent-cyan bg-clip-text text-transparent"
          >
            Nexus
          </span>
        </a>
        <button 
          *ngIf="!isCollapsed"
          (click)="toggleCollapse()"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-dark-surface-elevated hover:text-gray-100 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button 
          *ngIf="isCollapsed"
          (click)="toggleCollapse()"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-dark-surface-elevated hover:text-gray-100 transition-all mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <!-- Main Menu -->
        <div class="mb-6">
          <span *ngIf="!isCollapsed" class="block text-xs font-semibold uppercase tracking-wider text-gray-500 px-3 mb-3">
            Main Menu
          </span>
          
          <a 
            *ngFor="let item of mainNavItems" 
            [routerLink]="[item.route]" 
            routerLinkActive="bg-gradient-to-r from-primary-600/20 to-accent-cyan/10 text-primary-400"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 text-sm font-medium transition-all duration-200 mb-1 hover:bg-dark-surface-elevated hover:text-gray-100 group"
            [class.justify-center]="isCollapsed"
            [class.px-3]="isCollapsed"
            [title]="isCollapsed ? item.label : ''"
          >
            <span class="w-5 h-5 flex-shrink-0" [innerHTML]="item.icon"></span>
            <span *ngIf="!isCollapsed" class="flex-1">{{ item.label }}</span>
            <span 
              *ngIf="item.badge && !isCollapsed" 
              class="bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              {{ item.badge }}
            </span>
          </a>
        </div>

        <!-- Management Section -->
        <div class="mb-6">
          <span *ngIf="!isCollapsed" class="block text-xs font-semibold uppercase tracking-wider text-gray-500 px-3 mb-3">
            Management
          </span>
          
          <a 
            *ngFor="let item of managementNavItems" 
            [routerLink]="[item.route]" 
            routerLinkActive="bg-gradient-to-r from-primary-600/20 to-accent-cyan/10 text-primary-400"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 text-sm font-medium transition-all duration-200 mb-1 hover:bg-dark-surface-elevated hover:text-gray-100 group"
            [class.justify-center]="isCollapsed"
            [class.px-3]="isCollapsed"
            [title]="isCollapsed ? item.label : ''"
          >
            <span class="w-5 h-5 flex-shrink-0" [innerHTML]="item.icon"></span>
            <span *ngIf="!isCollapsed" class="flex-1">{{ item.label }}</span>
          </a>
        </div>
      </nav>

      <!-- User Profile & Logout -->
      <div class="p-4 border-t border-white/5">
        <!-- User Info Card -->
        <div *ngIf="!isCollapsed" class="flex items-center gap-3 p-3 bg-dark-surface-elevated rounded-xl mb-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-gray-100 truncate">{{ userName }}</div>
            <div class="text-xs text-gray-500 capitalize">{{ userRole }}</div>
          </div>
        </div>

        <!-- Collapsed Avatar -->
        <div *ngIf="isCollapsed" class="flex justify-center mb-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-white font-bold text-sm">
            {{ userInitials }}
          </div>
        </div>

        <!-- Logout Button -->
        <button 
          (click)="logout()"
          class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-gray-400 text-sm font-medium hover:bg-red-500/10 hover:text-red-400 transition-all"
          [title]="isCollapsed ? 'Logout' : ''"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span *ngIf="!isCollapsed">Logout</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
    @Input() isCollapsed = false;
    @Output() collapsedChange = new EventEmitter<boolean>();

    mainNavItems: NavItem[] = [
        {
            label: 'Dashboard',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>',
            route: '/dashboard'
        },
        {
            label: 'Analytics',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
            route: '/analytics'
        },
        {
            label: 'Orders',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
            route: '/orders',
            badge: 5
        }
    ];

    managementNavItems: NavItem[] = [
        {
            label: 'Users',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
            route: '/users'
        },
        {
            label: 'Activity Logs',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
            route: '/activities'
        },
        {
            label: 'Settings',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
            route: '/settings'
        }
    ];

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    get userName(): string {
        return this.authService.currentUser?.name || 'User';
    }

    get userRole(): string {
        return this.authService.currentUser?.role || 'user';
    }

    get userInitials(): string {
        const name = this.authService.currentUser?.name || 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    toggleCollapse(): void {
        this.isCollapsed = !this.isCollapsed;
        this.collapsedChange.emit(this.isCollapsed);
    }

    logout(): void {
        this.authService.logout();
    }
}
