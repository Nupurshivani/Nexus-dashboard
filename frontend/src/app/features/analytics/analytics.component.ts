import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, ChartData, DistributionData } from '../../core/services/admin.service';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-100 mb-2">Analytics</h1>
          <p class="text-gray-400">Detailed insights and performance metrics</p>
        </div>
        <div class="flex items-center gap-3 mt-4 md:mt-0">
          <select 
            [(ngModel)]="selectedPeriod"
            (change)="loadChartData()"
            class="px-4 py-2.5 bg-dark-surface-elevated border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="card text-center">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Total Page Views</p>
          <p class="text-2xl font-bold text-gray-100">{{ totalPageViews | number }}</p>
          <p class="text-xs text-emerald-400 mt-1">↑ 12.5%</p>
        </div>
        <div class="card text-center">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Unique Visitors</p>
          <p class="text-2xl font-bold text-gray-100">{{ uniqueVisitors | number }}</p>
          <p class="text-xs text-emerald-400 mt-1">↑ 8.3%</p>
        </div>
        <div class="card text-center">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">New Sign-ups</p>
          <p class="text-2xl font-bold text-gray-100">{{ newSignups | number }}</p>
          <p class="text-xs text-emerald-400 mt-1">↑ 23.1%</p>
        </div>
        <div class="card text-center">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Total Revenue</p>
          <p class="text-2xl font-bold text-gray-100">₹{{ totalRevenue | number }}</p>
          <p class="text-xs text-emerald-400 mt-1">↑ 15.7%</p>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <!-- User Growth Chart -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-100">User Growth</h2>
              <p class="text-sm text-gray-500">New user registrations over time</p>
            </div>
          </div>
          <div class="h-72">
            <canvas #userGrowthCanvas></canvas>
          </div>
        </div>

        <!-- Revenue Trend -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-100">Revenue Trend</h2>
              <p class="text-sm text-gray-500">Daily revenue performance</p>
            </div>
          </div>
          <div class="h-72">
            <canvas #revenueCanvas></canvas>
          </div>
        </div>

        <!-- Device Distribution -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-100">Device Distribution</h2>
              <p class="text-sm text-gray-500">User devices breakdown</p>
            </div>
          </div>
          <div class="flex items-center gap-8">
            <div class="h-56 w-56 flex-shrink-0">
              <canvas #deviceCanvas></canvas>
            </div>
            <div class="flex-1 space-y-3">
              <div *ngFor="let device of deviceData" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full" [style.background]="device.color"></span>
                  <span class="text-sm text-gray-400 capitalize">{{ device.name }}</span>
                </div>
                <span class="text-sm font-medium text-gray-100">{{ device.value }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Browser Distribution -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-100">Browser Distribution</h2>
              <p class="text-sm text-gray-500">Popular browsers used</p>
            </div>
          </div>
          <div class="space-y-4">
            <div *ngFor="let browser of browserData" class="flex items-center gap-4">
              <div class="w-20 text-sm text-gray-400 capitalize">{{ browser.name }}</div>
              <div class="flex-1 h-3 bg-dark-surface-elevated rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  [style.width.%]="browser.value"
                  [style.background]="browser.color"
                ></div>
              </div>
              <div class="w-12 text-sm text-gray-100 text-right">{{ browser.value }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Role & Status Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-100">User Roles</h2>
              <p class="text-sm text-gray-500">Distribution by role</p>
            </div>
          </div>
          <div class="h-64">
            <canvas #roleCanvas></canvas>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-100">User Status</h2>
              <p class="text-sm text-gray-500">Account status overview</p>
            </div>
          </div>
          <div class="h-64">
            <canvas #statusCanvas></canvas>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('userGrowthCanvas') userGrowthCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('revenueCanvas') revenueCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('deviceCanvas') deviceCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('roleCanvas') roleCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('statusCanvas') statusCanvas!: ElementRef<HTMLCanvasElement>;

    selectedPeriod: '7d' | '30d' | '90d' = '30d';
    chartData: ChartData | null = null;
    distribution: DistributionData | null = null;

    totalPageViews = 0;
    uniqueVisitors = 0;
    newSignups = 0;
    totalRevenue = 0;

    deviceData: { name: string; value: number; color: string }[] = [];
    browserData: { name: string; value: number; color: string }[] = [];

    private userGrowthChart: Chart | null = null;
    private revenueChart: Chart | null = null;
    private deviceChart: Chart | null = null;
    private roleChart: Chart | null = null;
    private statusChart: Chart | null = null;

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadData();
    }

    ngAfterViewInit(): void {
        // Charts will be initialized after data loads
    }

    loadData(): void {
        this.loadChartData();
        this.loadDistribution();
    }

    loadChartData(): void {
        this.adminService.getChartData(this.selectedPeriod).subscribe({
            next: (response) => {
                if (response.success) {
                    this.chartData = response.data;
                    this.calculateTotals();
                    setTimeout(() => this.initLineCharts(), 100);
                }
            },
            error: (err) => console.error('Error loading chart data:', err)
        });
    }

    loadDistribution(): void {
        this.adminService.getDistribution().subscribe({
            next: (response) => {
                if (response.success) {
                    this.distribution = response.data;
                    this.processDistribution();
                    setTimeout(() => this.initDistributionCharts(), 150);
                }
            },
            error: (err) => console.error('Error loading distribution:', err)
        });
    }

    private calculateTotals(): void {
        if (!this.chartData) return;
        this.totalPageViews = this.chartData.datasets.traffic.reduce((a, b) => a + b, 0);
        this.uniqueVisitors = Math.round(this.totalPageViews * 0.6);
        this.newSignups = this.chartData.datasets.users.reduce((a, b) => a + b, 0);
        this.totalRevenue = this.chartData.datasets.revenue.reduce((a, b) => a + b, 0);
    }

    private processDistribution(): void {
        if (!this.distribution) return;

        const deviceColors = ['#8b5cf6', '#06b6d4', '#f59e0b'];
        this.deviceData = Object.entries(this.distribution.devices).map(([name, value], i) => ({
            name,
            value: value as number,
            color: deviceColors[i % deviceColors.length]
        }));

        const browserColors = ['#8b5cf6', '#3b82f6', '#f59e0b', '#10b981', '#6b7280'];
        this.browserData = Object.entries(this.distribution.browsers).map(([name, value], i) => ({
            name,
            value: value as number,
            color: browserColors[i % browserColors.length]
        }));
    }

    private initLineCharts(): void {
        if (!this.chartData) return;

        // Destroy existing charts
        if (this.userGrowthChart) {
            this.userGrowthChart.destroy();
            this.userGrowthChart = null;
        }
        if (this.revenueChart) {
            this.revenueChart.destroy();
            this.revenueChart = null;
        }
        if (this.deviceChart) {
            this.deviceChart.destroy();
            this.deviceChart = null;
        }

        // User Growth Chart
        if (this.userGrowthCanvas?.nativeElement) {
            const ctx = this.userGrowthCanvas.nativeElement.getContext('2d');
            if (ctx) {
                const gradient = ctx.createLinearGradient(0, 0, 0, 250);
                gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
                gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

                this.userGrowthChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: this.chartData.labels,
                        datasets: [{
                            label: 'New Users',
                            data: this.chartData.datasets.users,
                            borderColor: '#8b5cf6',
                            backgroundColor: gradient,
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 6
                        }]
                    },
                    options: this.getLineChartOptions()
                });
            }
        }

        // Revenue Chart
        if (this.revenueCanvas?.nativeElement) {
            const ctx = this.revenueCanvas.nativeElement.getContext('2d');
            if (ctx) {
                const gradient = ctx.createLinearGradient(0, 0, 0, 250);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

                this.revenueChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: this.chartData.labels,
                        datasets: [{
                            label: 'Revenue',
                            data: this.chartData.datasets.revenue,
                            borderColor: '#10b981',
                            backgroundColor: gradient,
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 6
                        }]
                    },
                    options: this.getLineChartOptions()
                });
            }
        }

        // Device Chart
        if (this.deviceCanvas?.nativeElement && this.deviceData.length > 0) {
            const ctx = this.deviceCanvas.nativeElement.getContext('2d');
            if (ctx) {
                this.deviceChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: this.deviceData.map(d => d.name),
                        datasets: [{
                            data: this.deviceData.map(d => d.value),
                            backgroundColor: this.deviceData.map(d => d.color),
                            borderWidth: 0,
                            hoverOffset: 10
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '65%',
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }
    }

    private initDistributionCharts(): void {
        if (!this.distribution) return;

        // Destroy existing charts
        if (this.roleChart) {
            this.roleChart.destroy();
            this.roleChart = null;
        }
        if (this.statusChart) {
            this.statusChart.destroy();
            this.statusChart = null;
        }

        // Role Chart
        if (this.roleCanvas?.nativeElement) {
            const ctx = this.roleCanvas.nativeElement.getContext('2d');
            if (ctx) {
                const roleData = Object.entries(this.distribution.roles);
                this.roleChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: roleData.map(([k]) => k),
                        datasets: [{
                            data: roleData.map(([, v]) => v),
                            backgroundColor: ['#8b5cf6', '#3b82f6', '#f59e0b', '#10b981'],
                            borderRadius: 6
                        }]
                    },
                    options: this.getBarChartOptions()
                });
            }
        }

        // Status Chart
        if (this.statusCanvas?.nativeElement) {
            const ctx = this.statusCanvas.nativeElement.getContext('2d');
            if (ctx) {
                const statusData = Object.entries(this.distribution.status);
                this.statusChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: statusData.map(([k]) => k),
                        datasets: [{
                            data: statusData.map(([, v]) => v),
                            backgroundColor: ['#10b981', '#6b7280', '#ef4444', '#f59e0b'],
                            borderRadius: 6
                        }]
                    },
                    options: this.getBarChartOptions()
                });
            }
        }
    }

    private getLineChartOptions(): any {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#6b7280' }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#6b7280' },
                    beginAtZero: true
                }
            }
        };
    }

    private getBarChartOptions(): any {
        return {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y' as const,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#6b7280' }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#6b7280' }
                }
            }
        };
    }

    ngOnDestroy(): void {
        if (this.userGrowthChart) this.userGrowthChart.destroy();
        if (this.revenueChart) this.revenueChart.destroy();
        if (this.deviceChart) this.deviceChart.destroy();
        if (this.roleChart) this.roleChart.destroy();
        if (this.statusChart) this.statusChart.destroy();
    }
}
