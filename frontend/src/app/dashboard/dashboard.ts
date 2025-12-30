import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService, DashboardStats, ChartData, Order } from '../core/services/admin.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
          <p class="text-gray-400">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div class="flex items-center gap-3 mt-4 md:mt-0">
          <select 
            class="px-4 py-2.5 bg-dark-surface-elevated border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500"
            [(ngModel)]="selectedPeriod"
            (change)="onPeriodChange()"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Report
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <!-- Total Users -->
        <div class="card relative overflow-hidden group hover:shadow-glow-sm transition-all duration-300" style="--stat-accent: #8b5cf6">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Total Users</p>
              <p class="text-3xl font-bold text-gray-100">{{ stats?.users?.total | number }}</p>
              <div class="flex items-center gap-1 mt-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" 
                      [class]="stats?.users?.growth >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'">
                  <svg *ngIf="stats?.users?.growth >= 0" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  <svg *ngIf="stats?.users?.growth < 0" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                    <polyline points="17 18 23 18 23 12"></polyline>
                  </svg>
                  {{ stats?.users?.growth }}%
                </span>
                <span class="text-xs text-gray-500">vs last week</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="card relative overflow-hidden group hover:shadow-glow-sm transition-all duration-300">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Total Revenue</p>
              <p class="text-3xl font-bold text-gray-100">₹{{ formatRevenue(stats?.revenue?.total) }}</p>
              <div class="flex items-center gap-1 mt-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  {{ stats?.revenue?.growth }}%
                </span>
                <span class="text-xs text-gray-500">vs last month</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Orders -->
        <div class="card relative overflow-hidden group hover:shadow-glow-sm transition-all duration-300">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Total Orders</p>
              <p class="text-3xl font-bold text-gray-100">{{ stats?.orders?.total | number }}</p>
              <div class="flex items-center gap-1 mt-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400">
                  {{ stats?.orders?.pending }} pending
                </span>
              </div>
            </div>
            <div class="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Conversion Rate -->
        <div class="card relative overflow-hidden group hover:shadow-glow-sm transition-all duration-300">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan to-blue-500"></div>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Conversion Rate</p>
              <p class="text-3xl font-bold text-gray-100">{{ stats?.engagement?.conversionRate }}%</p>
              <div class="flex items-center gap-1 mt-2">
                <span class="text-xs text-gray-500">Based on {{ stats?.users?.active }} active users</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-accent-cyan/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <!-- Revenue Chart -->
        <div class="xl:col-span-2 card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-100">Revenue Overview</h2>
              <p class="text-sm text-gray-500">Monthly revenue trends</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-primary-500 rounded-full"></span>
                <span class="text-xs text-gray-400">Revenue</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-accent-cyan rounded-full"></span>
                <span class="text-xs text-gray-400">Orders</span>
              </div>
            </div>
          </div>
          <div class="chart-container h-80">
            <canvas #revenueChart></canvas>
          </div>
        </div>

        <!-- Distribution Chart -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-100">User Distribution</h2>
              <p class="text-sm text-gray-500">By department</p>
            </div>
          </div>
          <div class="chart-container h-64">
            <canvas #doughnutChart></canvas>
          </div>
          <div class="mt-4 space-y-2">
            <div *ngFor="let dept of departmentData" class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full" [style.background]="dept.color"></span>
                <span class="text-gray-400 capitalize">{{ dept.name }}</span>
              </div>
              <span class="font-medium text-gray-100">{{ dept.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-100">Recent Orders</h2>
              <p class="text-sm text-gray-500">Latest transactions</p>
            </div>
            <a routerLink="/orders" class="text-sm text-primary-400 hover:text-primary-300 transition-colors">
              View all →
            </a>
          </div>
          
          <div class="space-y-4">
            <div *ngFor="let order of recentOrders" 
                 class="flex items-center justify-between p-4 bg-dark-surface-elevated rounded-xl hover:bg-dark-surface-hover transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-100">{{ order.orderNumber }}</p>
                  <p class="text-xs text-gray-500">{{ order.customer.name }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-100">₹{{ order.total | number:'1.0-0' }}</p>
                <span 
                  class="badge"
                  [ngClass]="{
                    'badge-success': order.status === 'delivered',
                    'badge-warning': order.status === 'processing' || order.status === 'shipped',
                    'badge-info': order.status === 'pending',
                    'badge-error': order.status === 'cancelled'
                  }"
                >
                  {{ order.status }}
                </span>
              </div>
            </div>

            <div *ngIf="recentOrders.length === 0" class="text-center py-8">
              <div class="w-16 h-16 bg-dark-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <p class="text-gray-500">No recent orders</p>
            </div>
          </div>
        </div>

        <!-- Quick Stats / Traffic -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-100">Traffic Overview</h2>
              <p class="text-sm text-gray-500">Website performance metrics</p>
            </div>
          </div>

          <div class="chart-container h-48 mb-6">
            <canvas #trafficChart></canvas>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-dark-surface-elevated rounded-xl">
              <p class="text-xs text-gray-500 mb-1">Bounce Rate</p>
              <p class="text-xl font-bold text-gray-100">{{ stats?.engagement?.bounceRate }}%</p>
            </div>
            <div class="p-4 bg-dark-surface-elevated rounded-xl">
              <p class="text-xs text-gray-500 mb-1">Avg. Session</p>
              <p class="text-xl font-bold text-gray-100">{{ formatDuration(stats?.engagement?.avgSessionDuration) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trafficChart') trafficChartRef!: ElementRef<HTMLCanvasElement>;

  stats: DashboardStats | null = null;
  chartData: ChartData | null = null;
  recentOrders: Order[] = [];
  selectedPeriod: '7d' | '30d' | '90d' = '7d';

  departmentData: { name: string; count: number; color: string }[] = [];

  private revenueChart: Chart | null = null;
  private doughnutChart: Chart | null = null;
  private trafficChart: Chart | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after data loads
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  loadData(): void {
    // Load stats
    this.adminService.getStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        }
      }
    });

    // Load chart data
    this.adminService.getChartData(this.selectedPeriod).subscribe({
      next: (response) => {
        if (response.success) {
          this.chartData = response.data;
          this.initCharts();
        }
      }
    });

    // Load distribution
    this.adminService.getDistribution().subscribe({
      next: (response) => {
        if (response.success) {
          const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];
          this.departmentData = Object.entries(response.data.departments || {}).map(([name, count], i) => ({
            name,
            count: count as number,
            color: colors[i % colors.length]
          }));
          this.initDoughnutChart();
        }
      }
    });

    // Load recent orders
    this.adminService.getRecentOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.recentOrders = response.data.orders;
        }
      }
    });
  }

  onPeriodChange(): void {
    this.adminService.getChartData(this.selectedPeriod).subscribe({
      next: (response) => {
        if (response.success) {
          this.chartData = response.data;
          this.updateCharts();
        }
      }
    });
  }

  private initCharts(): void {
    if (!this.chartData) return;

    // Revenue Chart
    if (this.revenueChartRef?.nativeElement) {
      const ctx = this.revenueChartRef.nativeElement.getContext('2d');
      if (ctx) {
        if (this.revenueChart) this.revenueChart.destroy();

        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        this.revenueChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.chartData.labels,
            datasets: [
              {
                label: 'Revenue (₹)',
                data: this.chartData.datasets.revenue,
                borderColor: '#8b5cf6',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#8b5cf6'
              },
              {
                label: 'Orders',
                data: this.chartData.datasets.orders.map(v => v * 1000),
                borderColor: '#06b6d4',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#06b6d4',
                yAxisID: 'y1'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#1a1a24',
                titleColor: '#f3f4f6',
                bodyColor: '#9ca3af',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8
              }
            },
            scales: {
              x: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#6b7280' }
              },
              y: {
                position: 'left',
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: {
                  color: '#6b7280',
                  callback: (value) => '₹' + (Number(value) / 1000) + 'K'
                }
              },
              y1: {
                position: 'right',
                grid: { display: false },
                ticks: { color: '#6b7280' }
              }
            }
          }
        });
      }
    }

    // Traffic Chart
    if (this.trafficChartRef?.nativeElement) {
      const ctx = this.trafficChartRef.nativeElement.getContext('2d');
      if (ctx) {
        if (this.trafficChart) this.trafficChart.destroy();

        this.trafficChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.chartData.labels.slice(-7),
            datasets: [{
              label: 'Page Views',
              data: this.chartData.datasets.traffic.slice(-7),
              backgroundColor: 'rgba(139, 92, 246, 0.5)',
              borderColor: '#8b5cf6',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#6b7280', font: { size: 10 } }
              },
              y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#6b7280' },
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  }

  private initDoughnutChart(): void {
    if (!this.doughnutChartRef?.nativeElement || this.departmentData.length === 0) return;

    const ctx = this.doughnutChartRef.nativeElement.getContext('2d');
    if (ctx) {
      if (this.doughnutChart) this.doughnutChart.destroy();

      this.doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.departmentData.map(d => d.name),
          datasets: [{
            data: this.departmentData.map(d => d.count),
            backgroundColor: this.departmentData.map(d => d.color),
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1a24',
              titleColor: '#f3f4f6',
              bodyColor: '#9ca3af',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8
            }
          }
        }
      });
    }
  }

  private updateCharts(): void {
    if (this.revenueChart && this.chartData) {
      this.revenueChart.data.labels = this.chartData.labels;
      this.revenueChart.data.datasets[0].data = this.chartData.datasets.revenue;
      this.revenueChart.data.datasets[1].data = this.chartData.datasets.orders.map(v => v * 1000);
      this.revenueChart.update();
    }

    if (this.trafficChart && this.chartData) {
      this.trafficChart.data.labels = this.chartData.labels.slice(-7);
      this.trafficChart.data.datasets[0].data = this.chartData.datasets.traffic.slice(-7);
      this.trafficChart.update();
    }
  }

  private destroyCharts(): void {
    if (this.revenueChart) this.revenueChart.destroy();
    if (this.doughnutChart) this.doughnutChart.destroy();
    if (this.trafficChart) this.trafficChart.destroy();
  }

  formatRevenue(value: number | undefined): string {
    if (!value) return '0';
    if (value >= 100000) return (value / 100000).toFixed(1) + 'L';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  }

  formatDuration(seconds: number | undefined): string {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
