import { Router } from '@angular/router';

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  // 👉 REAL VALUES (used in cards)
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    sales: 0
  };

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
    this.router.navigate(['/login']);
    return; 
    }


    this.http.get<any>('http://localhost:5000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        // Assign real values
        this.stats.totalUsers = data.totalUsers;
        this.stats.activeUsers = data.activeUsers;
        this.stats.sales = data.sales;

        // Force Angular to update UI
        this.cdr.detectChanges();

        // Render chart after data arrives
        this.renderChart();
      },
      error: (err) => {
        console.error('Stats API error:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  renderChart(): void {
    if (!this.chartCanvas) return;

    // Scale sales ONLY for chart (to keep users visible)
    const scaledSales = Number((this.stats.sales / 1000).toFixed(3));


    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Total Users', 'Active Users', 'Sales (×1000)'],
        datasets: [{
          label: 'Admin Analytics',
          data: [
            this.stats.totalUsers,
            this.stats.activeUsers,
            scaledSales
          ],
          backgroundColor: ['#4f46e5', '#10b981', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
  logout(): void {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}

}
