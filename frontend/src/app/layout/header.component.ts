import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { AdminService, Notification } from '../core/services/admin.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-[72px] bg-dark-surface/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
      <!-- Left Section -->
      <div class="flex items-center gap-4">
        <!-- Mobile Menu Toggle -->
        <button 
          class="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-dark-surface-elevated hover:text-gray-100 transition-all"
          (click)="toggleMobileMenu()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Search Bar -->
        <div class="hidden md:flex items-center relative">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="w-5 h-5 text-gray-500 absolute left-4 pointer-events-none"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text"
            placeholder="Search anything..."
            class="w-80 pl-12 pr-4 py-2.5 bg-dark-surface-elevated border border-white/5 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 transition-all"
          >
          <kbd class="absolute right-4 px-2 py-0.5 bg-dark-surface text-gray-500 text-xs rounded border border-white/10">
            ⌘K
          </kbd>
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-3">
        <!-- Notifications -->
        <div class="relative">
          <button 
            class="relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-dark-surface-elevated hover:text-gray-100 transition-all"
            (click)="toggleNotifications()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span 
              *ngIf="unreadCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <div 
            *ngIf="showNotifications"
            class="absolute top-full right-0 mt-2 w-80 bg-dark-surface-elevated border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in"
          >
            <div class="flex items-center justify-between p-4 border-b border-white/10">
              <h3 class="font-semibold text-gray-100">Notifications</h3>
              <button 
                *ngIf="unreadCount > 0"
                (click)="markAllRead()"
                class="text-xs text-primary-400 hover:text-primary-300"
              >
                Mark all read
              </button>
            </div>
            
            <div class="max-h-80 overflow-y-auto">
              <div 
                *ngFor="let notification of notifications"
                class="p-4 border-b border-white/5 hover:bg-dark-surface-hover cursor-pointer transition-colors"
                [class.bg-primary-500/5]="!notification.read"
                (click)="markAsRead(notification)"
              >
                <div class="flex items-start gap-3">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    [ngClass]="{
                      'bg-blue-500/20 text-blue-400': notification.type === 'info',
                      'bg-emerald-500/20 text-emerald-400': notification.type === 'success',
                      'bg-amber-500/20 text-amber-400': notification.type === 'warning',
                      'bg-red-500/20 text-red-400': notification.type === 'error',
                      'bg-primary-500/20 text-primary-400': notification.type === 'system'
                    }"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-100 truncate">{{ notification.title }}</p>
                    <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ notification.message }}</p>
                    <p class="text-xs text-gray-600 mt-1">{{ getTimeAgo(notification.createdAt) }}</p>
                  </div>
                  <div *ngIf="!notification.read" class="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2"></div>
                </div>
              </div>

              <div *ngIf="notifications.length === 0" class="p-8 text-center">
                <div class="w-12 h-12 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <p class="text-sm text-gray-500">No notifications yet</p>
              </div>
            </div>

            <a 
              routerLink="/notifications"
              class="block p-3 text-center text-sm text-primary-400 hover:bg-dark-surface-hover border-t border-white/10 transition-colors"
              (click)="showNotifications = false"
            >
              View all notifications
            </a>
          </div>
        </div>

        <!-- Theme Toggle -->
        <button 
          class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-dark-surface-elevated hover:text-gray-100 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <!-- Profile Dropdown -->
        <div class="relative">
          <button 
            class="flex items-center gap-3 pl-3 pr-4 py-2 bg-dark-surface-elevated rounded-xl hover:bg-dark-surface-hover transition-all"
            (click)="toggleProfile()"
          >
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-white text-sm font-bold">
              {{ userInitials }}
            </div>
            <div class="hidden sm:block text-left">
              <div class="text-sm font-medium text-gray-100">{{ userName }}</div>
              <div class="text-xs text-gray-500 capitalize">{{ userRole }}</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <!-- Profile Dropdown Menu -->
          <div 
            *ngIf="showProfile"
            class="absolute top-full right-0 mt-2 w-56 bg-dark-surface-elevated border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-fade-in"
          >
            <a 
              routerLink="/settings"
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 rounded-lg hover:bg-dark-surface-hover hover:text-gray-100 transition-colors"
              (click)="showProfile = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile Settings
            </a>
            <a 
              routerLink="/settings"
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 rounded-lg hover:bg-dark-surface-hover hover:text-gray-100 transition-colors"
              (click)="showProfile = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Account Settings
            </a>
            <div class="h-px bg-white/10 my-2"></div>
            <button 
              (click)="logout()"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Click outside overlay for dropdowns -->
    <div 
      *ngIf="showNotifications || showProfile"
      class="fixed inset-0 z-20"
      (click)="closeDropdowns()"
    ></div>
  `
})
export class HeaderComponent implements OnInit {
  @Output() mobileMenuToggle = new EventEmitter<void>();

  showNotifications = false;
  showProfile = false;
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.adminService.getNotifications().subscribe({
      next: (response) => {
        if (response.success) {
          this.notifications = response.data.notifications;
          this.unreadCount = response.data.unreadCount;
        }
      }
    });
  }

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

  toggleMobileMenu(): void {
    this.mobileMenuToggle.emit();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
  }

  toggleProfile(): void {
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
  }

  closeDropdowns(): void {
    this.showNotifications = false;
    this.showProfile = false;
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.adminService.markNotificationRead(notification._id).subscribe();
      notification.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    }
  }

  markAllRead(): void {
    this.adminService.markAllNotificationsRead().subscribe(() => {
      this.notifications.forEach(n => n.read = true);
      this.unreadCount = 0;
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  }

  logout(): void {
    this.authService.logout();
  }
}
