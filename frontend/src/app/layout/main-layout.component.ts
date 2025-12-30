import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
    template: `
    <div class="min-h-screen bg-dark-bg">
      <!-- Sidebar -->
      <app-sidebar 
        [isCollapsed]="sidebarCollapsed"
        (collapsedChange)="sidebarCollapsed = $event"
      ></app-sidebar>

      <!-- Main Content Area -->
      <div 
        class="transition-all duration-300"
        [class.ml-72]="!sidebarCollapsed"
        [class.ml-20]="sidebarCollapsed"
      >
        <!-- Header -->
        <app-header (mobileMenuToggle)="toggleMobileMenu()"></app-header>

        <!-- Page Content -->
        <main class="p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Mobile Sidebar Overlay -->
      <div 
        *ngIf="mobileMenuOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        (click)="mobileMenuOpen = false"
      ></div>
    </div>
  `
})
export class MainLayoutComponent {
    sidebarCollapsed = false;
    mobileMenuOpen = false;

    toggleMobileMenu(): void {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }
}
