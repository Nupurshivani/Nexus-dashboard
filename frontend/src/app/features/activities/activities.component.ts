import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Activity } from '../../core/services/admin.service';

@Component({
    selector: 'app-activities',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-100 mb-2">Activity Logs</h1>
          <p class="text-gray-400">Track all user actions and system events</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <select 
            [(ngModel)]="actionFilter"
            (change)="loadActivities()"
            class="px-4 py-3 bg-dark-surface-elevated border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500"
          >
            <option value="">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="signup">Signup</option>
            <option value="profile_update">Profile Update</option>
            <option value="user_created">User Created</option>
            <option value="user_deleted">User Deleted</option>
            <option value="settings_changed">Settings Changed</option>
          </select>

          <select 
            [(ngModel)]="severityFilter"
            (change)="loadActivities()"
            class="px-4 py-3 bg-dark-surface-elevated border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500"
          >
            <option value="">All Severity</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <!-- Activity Timeline -->
      <div class="card">
        <div class="space-y-1">
          <div 
            *ngFor="let activity of activities; let i = index"
            class="flex gap-4 p-4 rounded-xl hover:bg-dark-surface-elevated transition-colors group"
          >
            <!-- Icon -->
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              [ngClass]="{
                'bg-blue-500/20 text-blue-400': activity.action === 'login' || activity.action === 'logout',
                'bg-emerald-500/20 text-emerald-400': activity.action === 'signup' || activity.action === 'user_created',
                'bg-amber-500/20 text-amber-400': activity.action === 'profile_update' || activity.action === 'settings_changed',
                'bg-red-500/20 text-red-400': activity.action === 'user_deleted',
                'bg-primary-500/20 text-primary-400': !['login', 'logout', 'signup', 'user_created', 'profile_update', 'settings_changed', 'user_deleted'].includes(activity.action)
              }"
            >
              <svg *ngIf="activity.action === 'login'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              <svg *ngIf="activity.action === 'logout'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <svg *ngIf="activity.action === 'signup' || activity.action === 'user_created'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              <svg *ngIf="activity.action === 'profile_update' || activity.action === 'settings_changed'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <svg *ngIf="activity.action === 'user_deleted'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="18" y1="8" x2="23" y2="13"></line>
                <line x1="23" y1="8" x2="18" y2="13"></line>
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm text-gray-100">{{ activity.description }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-gray-500">by {{ activity.user?.name || 'System' }}</span>
                    <span class="text-xs text-gray-600">•</span>
                    <span class="text-xs text-gray-500">{{ formatTime(activity.createdAt) }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span 
                    class="badge"
                    [ngClass]="{
                      'badge-info': activity.severity === 'info',
                      'badge-warning': activity.severity === 'warning',
                      'badge-error': activity.severity === 'error' || activity.severity === 'critical'
                    }"
                  >
                    {{ activity.severity }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="py-12 text-center">
            <div class="spinner spinner-lg mx-auto"></div>
          </div>

          <!-- Empty State -->
          <div *ngIf="activities.length === 0 && !loading" class="py-12 text-center">
            <div class="w-16 h-16 bg-dark-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <p class="text-gray-500">No activity logs found</p>
          </div>
        </div>

        <!-- Load More -->
        <div *ngIf="pagination.page < pagination.pages" class="mt-6 text-center">
          <button (click)="loadMore()" class="btn btn-secondary">
            Load More
          </button>
        </div>
      </div>
    </div>
  `
})
export class ActivitiesComponent implements OnInit {
    activities: Activity[] = [];
    loading = false;
    actionFilter = '';
    severityFilter = '';

    pagination = {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    };

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadActivities();
    }

    loadActivities(): void {
        this.loading = true;
        this.pagination.page = 1;
        this.activities = [];

        this.adminService.getActivities({
            page: this.pagination.page,
            limit: this.pagination.limit,
            action: this.actionFilter,
            severity: this.severityFilter
        }).subscribe({
            next: (response) => {
                if (response.success && response.data.activities) {
                    this.activities = response.data.activities;
                    this.pagination = { ...this.pagination, ...response.data.pagination };
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    loadMore(): void {
        this.pagination.page++;
        this.adminService.getActivities({
            page: this.pagination.page,
            limit: this.pagination.limit,
            action: this.actionFilter,
            severity: this.severityFilter
        }).subscribe({
            next: (response) => {
                if (response.success && response.data.activities) {
                    this.activities = [...this.activities, ...response.data.activities];
                }
            }
        });
    }

    formatTime(date: Date): string {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return diffMins + 'm ago';
        if (diffHours < 24) return diffHours + 'h ago';
        if (diffDays < 7) return diffDays + 'd ago';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}
