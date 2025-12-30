import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, User } from '../../core/services/admin.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-100 mb-2">User Management</h1>
          <p class="text-gray-400">Manage and organize all user accounts</p>
        </div>
        <button 
          (click)="openCreateModal()"
          class="btn btn-primary mt-4 md:mt-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New User
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="card mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text"
              [(ngModel)]="filters.search"
              (input)="onSearch()"
              placeholder="Search by name or email..."
              class="w-full pl-12 pr-4 py-3 bg-dark-surface-elevated border border-white/10 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
            >
          </div>

          <!-- Role Filter -->
          <select 
            [(ngModel)]="filters.role"
            (change)="applyFilters()"
            class="px-4 py-3 bg-dark-surface-elevated border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500 min-w-[150px]"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
            <option value="moderator">Moderator</option>
          </select>

          <!-- Status Filter -->
          <select 
            [(ngModel)]="filters.status"
            (change)="applyFilters()"
            class="px-4 py-3 bg-dark-surface-elevated border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500 min-w-[150px]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          <!-- Department Filter -->
          <select 
            [(ngModel)]="filters.department"
            (change)="applyFilters()"
            class="px-4 py-3 bg-dark-surface-elevated border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500 min-w-[150px]"
          >
            <option value="">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card">
        <div *ngIf="!loading" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/5">
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">User</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Role</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Department</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Last Active</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                *ngFor="let user of users; let i = index"
                class="border-b border-white/5 hover:bg-dark-surface-elevated transition-colors"
                [class.animate-fade-in]="true"
                [style.animation-delay]="(i * 50) + 'ms'"
              >
                <!-- User Info -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-white text-sm font-bold">
                      {{ getInitials(user.name) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-100">{{ user.name }}</p>
                      <p class="text-xs text-gray-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>

                <!-- Role -->
                <td class="px-4 py-4">
                  <span 
                    class="badge"
                    [ngClass]="{
                      'badge-primary': user.role === 'superadmin',
                      'badge-info': user.role === 'admin',
                      'badge-warning': user.role === 'moderator',
                      'badge-neutral': user.role === 'user'
                    }"
                  >
                    {{ user.role }}
                  </span>
                </td>

                <!-- Department -->
                <td class="px-4 py-4">
                  <span class="text-sm text-gray-300 capitalize">{{ user.department || '-' }}</span>
                </td>

                <!-- Status -->
                <td class="px-4 py-4">
                  <span 
                    class="badge"
                    [ngClass]="{
                      'badge-success': user.status === 'active',
                      'badge-neutral': user.status === 'inactive',
                      'badge-error': user.status === 'suspended',
                      'badge-warning': user.status === 'pending'
                    }"
                  >
                    <span class="w-1.5 h-1.5 rounded-full mr-1"
                          [ngClass]="{
                            'bg-emerald-400': user.status === 'active',
                            'bg-gray-400': user.status === 'inactive',
                            'bg-red-400': user.status === 'suspended',
                            'bg-amber-400': user.status === 'pending'
                          }"></span>
                    {{ user.status }}
                  </span>
                </td>

                <!-- Last Active -->
                <td class="px-4 py-4">
                  <span class="text-sm text-gray-400">{{ formatDate(user.lastLogin) }}</span>
                </td>

                <!-- Actions -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2">
                    <button 
                      (click)="editUser(user)"
                      class="p-2 rounded-lg text-gray-400 hover:bg-dark-surface-hover hover:text-primary-400 transition-all"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button 
                      (click)="toggleStatus(user)"
                      class="p-2 rounded-lg text-gray-400 hover:bg-dark-surface-hover transition-all"
                      [class.hover:text-emerald-400]="user.status !== 'active'"
                      [class.hover:text-amber-400]="user.status === 'active'"
                      [title]="user.status === 'active' ? 'Deactivate' : 'Activate'"
                    >
                      <svg *ngIf="user.status === 'active'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                      </svg>
                      <svg *ngIf="user.status !== 'active'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </button>
                    <button 
                      (click)="confirmDelete(user)"
                      class="p-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="users.length === 0 && !loading" class="py-12 text-center">
          <div class="w-16 h-16 bg-dark-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <p class="text-gray-500">No users found</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="py-12 text-center">
          <div class="spinner spinner-lg mx-auto mb-4"></div>
          <p class="text-gray-500">Loading users...</p>
        </div>

        <!-- Pagination -->
        <div *ngIf="pagination.pages > 1" class="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
          <p class="text-sm text-gray-500">
            Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} users
          </p>
          <div class="flex items-center gap-2">
            <button 
              (click)="goToPage(pagination.page - 1)"
              [disabled]="pagination.page === 1"
              class="px-4 py-2 bg-dark-surface-elevated border border-white/10 rounded-lg text-sm text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-surface-hover transition-all"
            >
              Previous
            </button>
            <button 
              *ngFor="let page of getPageNumbers()"
              (click)="goToPage(page)"
              class="w-10 h-10 rounded-lg text-sm font-medium transition-all"
              [class.bg-primary-600]="page === pagination.page"
              [class.text-white]="page === pagination.page"
              [class.bg-dark-surface-elevated]="page !== pagination.page"
              [class.text-gray-300]="page !== pagination.page"
              [class.hover:bg-dark-surface-hover]="page !== pagination.page"
            >
              {{ page }}
            </button>
            <button 
              (click)="goToPage(pagination.page + 1)"
              [disabled]="pagination.page === pagination.pages"
              class="px-4 py-2 bg-dark-surface-elevated border border-white/10 rounded-lg text-sm text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-surface-hover transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal max-w-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">{{ editingUser ? 'Edit User' : 'Create New User' }}</h2>
            <button (click)="closeModal()" class="p-2 rounded-lg text-gray-400 hover:bg-dark-surface-elevated hover:text-gray-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveUser()">
              <div class="space-y-4">
                <!-- Name -->
                <div>
                  <label class="input-label">Full Name</label>
                  <input type="text" [(ngModel)]="formData.name" name="name" required class="input" placeholder="Enter full name">
                </div>

                <!-- Email -->
                <div>
                  <label class="input-label">Email Address</label>
                  <input type="email" [(ngModel)]="formData.email" name="email" required class="input" placeholder="Enter email">
                </div>

                <!-- Password (only for create) -->
                <div *ngIf="!editingUser">
                  <label class="input-label">Password</label>
                  <input type="password" [(ngModel)]="formData.password" name="password" required class="input" placeholder="Enter password">
                </div>

                <!-- Role -->
                <div>
                  <label class="input-label">Role</label>
                  <select [(ngModel)]="formData.role" name="role" class="input">
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>

                <!-- Department -->
                <div>
                  <label class="input-label">Department</label>
                  <select [(ngModel)]="formData.department" name="department" class="input">
                    <option value="engineering">Engineering</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="support">Support</option>
                    <option value="hr">HR</option>
                    <option value="finance">Finance</option>
                    <option value="operations">Operations</option>
                  </select>
                </div>

                <!-- Status -->
                <div>
                  <label class="input-label">Status</label>
                  <select [(ngModel)]="formData.status" name="status" class="input">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="saveUser()" class="btn btn-primary" [disabled]="saving">
              {{ saving ? 'Saving...' : (editingUser ? 'Update User' : 'Create User') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay" (click)="showDeleteModal = false">
        <div class="modal max-w-md" (click)="$event.stopPropagation()">
          <div class="modal-body text-center py-8">
            <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Delete User</h3>
            <p class="text-gray-400 mb-6">Are you sure you want to delete <span class="text-gray-100 font-medium">{{ userToDelete?.name }}</span>? This action cannot be undone.</p>
            <div class="flex items-center justify-center gap-3">
              <button (click)="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
              <button (click)="deleteUser()" class="btn btn-danger">Delete User</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  saving = false;

  filters = {
    search: '',
    role: '',
    status: '',
    department: ''
  };

  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  };

  showModal = false;
  showDeleteModal = false;
  editingUser: User | null = null;
  userToDelete: User | null = null;

  formData = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    department: 'engineering',
    status: 'active'
  };

  private searchTimeout: any;
  Math = Math; // For template

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers({
      page: this.pagination.page,
      limit: this.pagination.limit,
      search: this.filters.search,
      role: this.filters.role,
      status: this.filters.status,
      department: this.filters.department
    }).subscribe({
      next: (response) => {
        console.log('UsersComponent loaded:', response);
        if (response.success && response.data.users) {
          this.users = response.data.users;
          this.pagination = {
            ...this.pagination,
            ...response.data.pagination
          };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('UsersComponent error:', err);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pagination.page = 1;
      this.loadUsers();
    }, 300);
  }

  applyFilters(): void {
    this.pagination.page = 1;
    this.loadUsers();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pagination.pages) return;
    this.pagination.page = page;
    this.loadUsers();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.pagination.page - 2);
    const end = Math.min(this.pagination.pages, start + 4);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'Never';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  openCreateModal(): void {
    this.editingUser = null;
    this.formData = {
      name: '',
      email: '',
      password: '',
      role: 'user',
      department: 'engineering',
      status: 'active'
    };
    this.showModal = true;
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.formData = {
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      department: user.department || 'engineering',
      status: user.status
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
  }

  saveUser(): void {
    this.saving = true;

    if (this.editingUser) {
      this.adminService.updateUser(this.editingUser._id, this.formData).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          this.loadUsers();
        },
        error: () => {
          this.saving = false;
        }
      });
    } else {
      this.adminService.createUser(this.formData as any).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          this.loadUsers();
        },
        error: () => {
          this.saving = false;
        }
      });
    }
  }

  toggleStatus(user: User): void {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    this.adminService.updateUserStatus(user._id, newStatus).subscribe({
      next: () => {
        user.status = newStatus;
      }
    });
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    this.adminService.deleteUser(this.userToDelete._id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.userToDelete = null;
        this.loadUsers();
      }
    });
  }
}
