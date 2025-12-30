import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in max-w-4xl">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-100 mb-2">Settings</h1>
        <p class="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <!-- Settings Tabs -->
      <div class="flex gap-2 mb-8 border-b border-white/10 pb-1">
        <button 
          *ngFor="let tab of tabs"
          (click)="activeTab = tab.id"
          class="px-4 py-2 text-sm font-medium rounded-t-lg transition-all"
          [class.text-primary-400]="activeTab === tab.id"
          [class.border-b-2]="activeTab === tab.id"
          [class.border-primary-500]="activeTab === tab.id"
          [class.text-gray-400]="activeTab !== tab.id"
          [class.hover:text-gray-300]="activeTab !== tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Profile Settings -->
      <div *ngIf="activeTab === 'profile'" class="space-y-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-100 mb-6">Profile Information</h2>
          
          <!-- Avatar -->
          <div class="flex items-center gap-6 mb-8">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-white text-2xl font-bold">
              {{ getInitials() }}
            </div>
            <div>
              <button class="btn btn-secondary btn-sm mb-2">Upload Photo</button>
              <p class="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="input-label">Full Name</label>
              <input type="text" [(ngModel)]="profile.name" class="input" placeholder="Your name">
            </div>
            <div>
              <label class="input-label">Email Address</label>
              <input type="email" [(ngModel)]="profile.email" class="input" placeholder="your@email.com" disabled>
              <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label class="input-label">Phone Number</label>
              <input type="tel" [(ngModel)]="profile.phone" class="input" placeholder="+91 98765 43210">
            </div>
            <div>
              <label class="input-label">Department</label>
              <select [(ngModel)]="profile.department" class="input">
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="support">Support</option>
                <option value="hr">HR</option>
                <option value="finance">Finance</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button (click)="saveProfile()" class="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div *ngIf="activeTab === 'security'" class="space-y-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-100 mb-6">Change Password</h2>
          
          <div class="max-w-md space-y-4">
            <div>
              <label class="input-label">Current Password</label>
              <input type="password" [(ngModel)]="passwords.current" class="input" placeholder="Enter current password">
            </div>
            <div>
              <label class="input-label">New Password</label>
              <input type="password" [(ngModel)]="passwords.new" class="input" placeholder="Enter new password">
            </div>
            <div>
              <label class="input-label">Confirm New Password</label>
              <input type="password" [(ngModel)]="passwords.confirm" class="input" placeholder="Confirm new password">
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button class="btn btn-primary">Update Password</button>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-semibold text-gray-100 mb-4">Two-Factor Authentication</h2>
          <p class="text-sm text-gray-400 mb-4">Add an extra layer of security to your account</p>
          
          <div class="flex items-center justify-between p-4 bg-dark-surface-elevated rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-100">Authenticator App</p>
                <p class="text-xs text-gray-500">Use an authenticator app to get codes</p>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm">Enable</button>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-semibold text-gray-100 mb-4">Active Sessions</h2>
          <p class="text-sm text-gray-400 mb-4">Manage your active login sessions</p>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 bg-dark-surface-elevated rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-100">Chrome on Windows</p>
                  <p class="text-xs text-gray-500">Mumbai, India • Current session</p>
                </div>
              </div>
              <span class="badge badge-success">Active</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Preferences Settings -->
      <div *ngIf="activeTab === 'preferences'" class="space-y-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-100 mb-6">Appearance</h2>
          
          <div class="space-y-4">
            <div>
              <label class="input-label">Theme</label>
              <div class="grid grid-cols-3 gap-3 mt-2">
                <button 
                  *ngFor="let theme of themes"
                  (click)="preferences.theme = theme.value"
                  class="p-4 rounded-xl border transition-all"
                  [class.border-primary-500]="preferences.theme === theme.value"
                  [class.bg-primary-500/10]="preferences.theme === theme.value"
                  [class.border-white/10]="preferences.theme !== theme.value"
                  [class.hover:border-white/20]="preferences.theme !== theme.value"
                >
                  <div class="text-center">
                    <div class="text-2xl mb-1">{{ theme.icon }}</div>
                    <p class="text-sm text-gray-300">{{ theme.label }}</p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label class="input-label">Language</label>
              <select [(ngModel)]="preferences.language" class="input max-w-xs">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-semibold text-gray-100 mb-6">Notifications</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-dark-surface-elevated rounded-xl">
              <div>
                <p class="text-sm font-medium text-gray-100">Email Notifications</p>
                <p class="text-xs text-gray-500">Receive email updates about your account</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="preferences.emailNotifications" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 bg-dark-surface-elevated rounded-xl">
              <div>
                <p class="text-sm font-medium text-gray-100">Push Notifications</p>
                <p class="text-xs text-gray-500">Receive push notifications in browser</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="preferences.pushNotifications" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 bg-dark-surface-elevated rounded-xl">
              <div>
                <p class="text-sm font-medium text-gray-100">Weekly Reports</p>
                <p class="text-xs text-gray-500">Receive weekly analytics summary</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="preferences.weeklyReports" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button class="btn btn-primary">Save Preferences</button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div *ngIf="activeTab === 'danger'" class="space-y-6">
        <div class="card border-red-500/20">
          <h2 class="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
          <p class="text-sm text-gray-400 mb-6">Irreversible and destructive actions</p>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div>
                <p class="text-sm font-medium text-gray-100">Export Account Data</p>
                <p class="text-xs text-gray-500">Download all your account data</p>
              </div>
              <button class="btn btn-secondary btn-sm">Export</button>
            </div>

            <div class="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div>
                <p class="text-sm font-medium text-gray-100">Reset & Seed Database</p>
                <p class="text-xs text-gray-500">Reset database and fill with sample data (Admin Only)</p>
              </div>
              <button (click)="seedDatabase()" class="btn btn-warning btn-sm">Reset DB</button>
            </div>

            <div class="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div>
                <p class="text-sm font-medium text-gray-100">Delete Account</p>
                <p class="text-xs text-gray-500">Permanently delete your account and all data</p>
              </div>
              <button class="btn btn-danger btn-sm">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  activeTab = 'profile';

  tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'danger', label: 'Danger Zone' }
  ];

  themes = [
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'system', label: 'System', icon: '💻' }
  ];

  profile = {
    name: '',
    email: '',
    phone: '',
    department: 'engineering'
  };

  passwords = {
    current: '',
    new: '',
    confirm: ''
  };

  preferences = {
    theme: 'dark',
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true
  };

  constructor(private authService: AuthService, private http: import('@angular/common/http').HttpClient) { }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.profile.name = user.name;
      this.profile.email = user.email;
      this.profile.phone = user.phone || '';
      this.profile.department = user.department || 'engineering';
    }
  }

  getInitials(): string {
    return this.profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  }

  saveProfile(): void {
    // Would call API to save profile
    console.log('Saving profile:', this.profile);
  }

  seedDatabase(): void {
    if (!confirm('Are you sure? This will DELETE ALL DATA and reset the database to sample data.')) return;

    // Use 'any' to access private static prop if needed, or better, make it public in service. 
    // Assuming API_URL is accessible or we hardcode /api since we used a proxy
    const apiUrl = this.authService['API_URL'] || '/api';

    this.http.post(`${apiUrl}/auth/seed`, {}, {
      headers: { 'Authorization': `Bearer ${this.authService.token}` }
    }).subscribe({
      next: (res: any) => {
        alert('Database seeded successfully! Please relogin with email: admin@dashboard.com password: admin123');
        this.authService.logout();
      },
      error: (err) => {
        console.error('Seed error:', err);
        // If 403, maybe not an admin or DB not empty?
        alert('Error seeding database: ' + (err.error?.msg || err.message));
      }
    });
  }
}
