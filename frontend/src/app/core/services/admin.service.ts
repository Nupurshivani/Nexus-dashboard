import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface DashboardStats {
    users: {
        total: number;
        active: number;
        newThisMonth: number;
        newThisWeek: number;
        growth: number;
    };
    orders: {
        total: number;
        pending: number;
        completed: number;
        processingRate: string;
    };
    revenue: {
        total: number;
        monthly: number;
        growth: number;
        currency: string;
    };
    engagement: {
        bounceRate: number;
        avgSessionDuration: number;
        conversionRate: number;
    };
}

export interface ChartData {
    labels: string[];
    datasets: {
        users: number[];
        revenue: number[];
        orders: number[];
        traffic: number[];
    };
}

export interface DistributionData {
    roles: Record<string, number>;
    status: Record<string, number>;
    departments: Record<string, number>;
    orderStatus: Record<string, number>;
    devices: Record<string, number>;
    browsers: Record<string, number>;
}

export interface User {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: string;
    status: string;
    department?: string;
    avatar?: string;
    phone?: string;
    location?: { city?: string; country?: string };
    lastLogin?: Date;
    createdAt?: Date;
    loginCount?: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: {
        users?: T[];
        orders?: T[];
        activities?: T[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    };
}

export interface Order {
    _id: string;
    orderNumber: string;
    customer: { name: string; email: string; phone?: string };
    items: Array<{ name: string; quantity: number; price: number; total: number }>;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: Date;
}

export interface Activity {
    _id: string;
    user: { name: string; email: string; avatar?: string };
    action: string;
    description: string;
    severity: string;
    status: string;
    createdAt: Date;
}

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    category: string;
    read: boolean;
    createdAt: Date;
}

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly API_URL = `${environment.apiUrl}/admin`;

    private statsSubject = new BehaviorSubject<DashboardStats | null>(null);
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    private unreadCountSubject = new BehaviorSubject<number>(0);

    stats$ = this.statsSubject.asObservable();
    notifications$ = this.notificationsSubject.asObservable();
    unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // ==================== Dashboard ====================

    getStats(): Observable<{ success: boolean; data: DashboardStats }> {
        return this.http.get<{ success: boolean; data: DashboardStats }>(`${this.API_URL}/stats`, {
            headers: this.getHeaders()
        }).pipe(
            tap(response => {
                if (response.success) {
                    this.statsSubject.next(response.data);
                }
            })
        );
    }

    getChartData(period: '7d' | '30d' | '90d' = '7d'): Observable<{ success: boolean; data: ChartData }> {
        return this.http.get<{ success: boolean; data: ChartData }>(`${this.API_URL}/chart-data`, {
            headers: this.getHeaders(),
            params: { period }
        });
    }

    getDistribution(): Observable<{ success: boolean; data: DistributionData }> {
        return this.http.get<{ success: boolean; data: DistributionData }>(`${this.API_URL}/distribution`, {
            headers: this.getHeaders()
        });
    }

    // ==================== User Management ====================

    getUsers(params: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
        department?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    } = {}): Observable<PaginatedResponse<User>> {
        let httpParams = new HttpParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                httpParams = httpParams.set(key, String(value));
            }
        });

        return this.http.get<PaginatedResponse<User>>(`${this.API_URL}/users`, {
            headers: this.getHeaders(),
            params: httpParams
        });
    }

    getUser(id: string): Observable<{ success: boolean; data: { user: User; activities: Activity[] } }> {
        return this.http.get<{ success: boolean; data: { user: User; activities: Activity[] } }>(`${this.API_URL}/users/${id}`, {
            headers: this.getHeaders()
        });
    }

    createUser(userData: Partial<User> & { password: string }): Observable<{ success: boolean; data: { user: User } }> {
        return this.http.post<{ success: boolean; data: { user: User } }>(`${this.API_URL}/users`, userData, {
            headers: this.getHeaders()
        });
    }

    updateUser(id: string, userData: Partial<User>): Observable<{ success: boolean; data: { user: User } }> {
        return this.http.put<{ success: boolean; data: { user: User } }>(`${this.API_URL}/users/${id}`, userData, {
            headers: this.getHeaders()
        });
    }

    deleteUser(id: string): Observable<{ success: boolean; msg: string }> {
        return this.http.delete<{ success: boolean; msg: string }>(`${this.API_URL}/users/${id}`, {
            headers: this.getHeaders()
        });
    }

    updateUserStatus(id: string, status: string): Observable<{ success: boolean; data: { user: User } }> {
        return this.http.patch<{ success: boolean; data: { user: User } }>(`${this.API_URL}/users/${id}/status`, { status }, {
            headers: this.getHeaders()
        });
    }

    // ==================== Activities ====================

    getActivities(params: {
        page?: number;
        limit?: number;
        action?: string;
        severity?: string;
        userId?: string;
    } = {}): Observable<PaginatedResponse<Activity>> {
        let httpParams = new HttpParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                httpParams = httpParams.set(key, String(value));
            }
        });

        return this.http.get<PaginatedResponse<Activity>>(`${this.API_URL}/activities`, {
            headers: this.getHeaders(),
            params: httpParams
        });
    }

    // ==================== Orders ====================

    getOrders(params: {
        page?: number;
        limit?: number;
        status?: string;
        paymentStatus?: string;
    } = {}): Observable<PaginatedResponse<Order>> {
        let httpParams = new HttpParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                httpParams = httpParams.set(key, String(value));
            }
        });

        return this.http.get<PaginatedResponse<Order>>(`${this.API_URL}/orders`, {
            headers: this.getHeaders(),
            params: httpParams
        });
    }

    getRecentOrders(): Observable<{ success: boolean; data: { orders: Order[] } }> {
        return this.http.get<{ success: boolean; data: { orders: Order[] } }>(`${this.API_URL}/orders/recent`, {
            headers: this.getHeaders()
        });
    }

    // ==================== Notifications ====================

    getNotifications(): Observable<{ success: boolean; data: { notifications: Notification[]; unreadCount: number } }> {
        return this.http.get<{ success: boolean; data: { notifications: Notification[]; unreadCount: number } }>(`${this.API_URL}/notifications`, {
            headers: this.getHeaders()
        }).pipe(
            tap(response => {
                if (response.success) {
                    this.notificationsSubject.next(response.data.notifications);
                    this.unreadCountSubject.next(response.data.unreadCount);
                }
            })
        );
    }

    markNotificationRead(id: string): Observable<{ success: boolean }> {
        return this.http.patch<{ success: boolean }>(`${this.API_URL}/notifications/${id}/read`, {}, {
            headers: this.getHeaders()
        }).pipe(
            tap(() => {
                const current = this.notificationsSubject.value;
                const updated = current.map(n => n._id === id ? { ...n, read: true } : n);
                this.notificationsSubject.next(updated);
                this.unreadCountSubject.next(Math.max(0, this.unreadCountSubject.value - 1));
            })
        );
    }

    markAllNotificationsRead(): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.API_URL}/notifications/read-all`, {}, {
            headers: this.getHeaders()
        }).pipe(
            tap(() => {
                const current = this.notificationsSubject.value;
                const updated = current.map(n => ({ ...n, read: true }));
                this.notificationsSubject.next(updated);
                this.unreadCountSubject.next(0);
            })
        );
    }
}
