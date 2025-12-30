import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Order } from '../../core/services/admin.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-100 mb-2">Orders</h1>
          <p class="text-gray-400">Manage and track all customer orders</p>
        </div>
      </div>

      <!-- Order Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-100">{{ pendingCount }}</p>
              <p class="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-100">{{ shippedCount }}</p>
              <p class="text-xs text-gray-500">Shipped</p>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-100">{{ deliveredCount }}</p>
              <p class="text-xs text-gray-500">Delivered</p>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-100">{{ cancelledCount }}</p>
              <p class="text-xs text-gray-500">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <select 
            [(ngModel)]="statusFilter"
            (change)="loadOrders()"
            class="px-4 py-3 bg-dark-surface-elevated border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            [(ngModel)]="paymentFilter"
            (change)="loadOrders()"
            class="px-4 py-3 bg-dark-surface-elevated border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Payment Pending</option>
            <option value="completed">Payment Completed</option>
            <option value="failed">Payment Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="card">
        <div *ngIf="!loading" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/5">
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Order ID</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Customer</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Items</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Total</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Payment</th>
                <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                *ngFor="let order of orders"
                class="border-b border-white/5 hover:bg-dark-surface-elevated transition-colors"
              >
                <td class="px-4 py-4">
                  <span class="text-sm font-mono font-medium text-primary-400">{{ order.orderNumber }}</span>
                </td>
                <td class="px-4 py-4">
                  <div>
                    <p class="text-sm font-medium text-gray-100">{{ order.customer.name }}</p>
                    <p class="text-xs text-gray-500">{{ order.customer.email }}</p>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <span class="text-sm text-gray-300">{{ order.items.length }} item(s)</span>
                </td>
                <td class="px-4 py-4">
                  <span class="text-sm font-semibold text-gray-100">₹{{ order.total | number:'1.0-0' }}</span>
                </td>
                <td class="px-4 py-4">
                  <span 
                    class="badge"
                    [ngClass]="{
                      'badge-info': order.status === 'pending',
                      'badge-warning': order.status === 'processing' || order.status === 'shipped',
                      'badge-success': order.status === 'delivered',
                      'badge-error': order.status === 'cancelled'
                    }"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <span 
                    class="badge"
                    [ngClass]="{
                      'badge-warning': order.paymentStatus === 'pending',
                      'badge-success': order.paymentStatus === 'completed',
                      'badge-error': order.paymentStatus === 'failed' || order.paymentStatus === 'refunded'
                    }"
                  >
                    {{ order.paymentStatus }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <span class="text-sm text-gray-400">{{ formatDate(order.createdAt) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="py-12 text-center">
          <div class="spinner spinner-lg mx-auto"></div>
        </div>

        <!-- Empty State -->
        <div *ngIf="orders.length === 0 && !loading" class="py-12 text-center">
          <div class="w-16 h-16 bg-dark-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <p class="text-gray-500">No orders found</p>
        </div>

        <!-- Pagination -->
        <div *ngIf="pagination.pages > 1" class="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
          <p class="text-sm text-gray-500">
            Page {{ pagination.page }} of {{ pagination.pages }}
          </p>
          <div class="flex items-center gap-2">
            <button 
              (click)="goToPage(pagination.page - 1)"
              [disabled]="pagination.page === 1"
              class="btn btn-secondary btn-sm"
            >
              Previous
            </button>
            <button 
              (click)="goToPage(pagination.page + 1)"
              [disabled]="pagination.page === pagination.pages"
              class="btn btn-secondary btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  statusFilter = '';
  paymentFilter = '';

  pendingCount = 0;
  shippedCount = 0;
  deliveredCount = 0;
  cancelledCount = 0;

  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  };

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.adminService.getOrders({
      page: this.pagination.page,
      limit: this.pagination.limit,
      status: this.statusFilter,
      paymentStatus: this.paymentFilter
    }).subscribe({
      next: (response) => {
        if (response.success && response.data.orders) {
          this.orders = response.data.orders;
          this.pagination = { ...this.pagination, ...response.data.pagination };
          this.calculateCounts();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private calculateCounts(): void {
    this.pendingCount = this.orders.filter(o => o.status === 'pending').length;
    this.shippedCount = this.orders.filter(o => o.status === 'shipped').length;
    this.deliveredCount = this.orders.filter(o => o.status === 'delivered').length;
    this.cancelledCount = this.orders.filter(o => o.status === 'cancelled').length;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pagination.pages) return;
    this.pagination.page = page;
    this.loadOrders();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
