import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface ShopMetric {
    total: number;
    variation: number;
    trend: 'up' | 'down';
}

export interface ShopMetrics {
    customers: ShopMetric;
    orders: ShopMetric;
}

export interface MonthlySales {
    categories: string[];
    series: { name: string; data: number[] }[];
}

export interface ShopDashboardStats {
    metrics: ShopMetrics;
    monthlySales: MonthlySales;
}

export interface MonthlyTargetStat {
    value: number;
    trend: 'up' | 'down';
}

export interface MonthlyTarget {
    progressPercent: number;
    target: MonthlyTargetStat;
    revenue: MonthlyTargetStat;
    today: MonthlyTargetStat;
}

export interface SalesStatistics {
    categories: string[];
    series: { name: string; data: number[] }[];
}

@Injectable({
    providedIn: 'root',
})
export class ShopStatsService {

    private getShopId(): string {
        return localStorage.getItem('selectedShopId') ?? '';
    }

    private apiUrl = `${environment.apiUrl}/stats`;

    constructor(private http: HttpClient) { }

    getShopDashboardStats(): Observable<ApiResponse<ShopDashboardStats>> {
        return this.http.get<ApiResponse<ShopDashboardStats>>(`${this.apiUrl}/shop-dashboard/${this.getShopId()}`);
    }

    getShopMetrics(): Observable<ApiResponse<ShopMetrics>> {
        return this.http.get<ApiResponse<ShopMetrics>>(`${this.apiUrl}/shop-metrics/${this.getShopId()}`);
    }

    getMonthlySales(): Observable<ApiResponse<MonthlySales>> {
        return this.http.get<ApiResponse<MonthlySales>>(`${this.apiUrl}/monthly-sales/${this.getShopId()}`);
    }

    getMonthlyTarget(): Observable<ApiResponse<MonthlyTarget>> {
        return this.http.get<ApiResponse<MonthlyTarget>>(`${this.apiUrl}/monthly-target/${this.getShopId()}`);
    }

    getSalesStatistics(): Observable<ApiResponse<SalesStatistics>> {
        return this.http.get<ApiResponse<SalesStatistics>>(`${this.apiUrl}/sales-statistics/${this.getShopId()}`);
    }

    updateSalesStatistics(monthIndex: number, salesValue: number, revenueValue: number): Observable<ApiResponse<SalesStatistics>> {
        return this.http.put<ApiResponse<SalesStatistics>>(`${this.apiUrl}/sales-statistics/${this.getShopId()}`, {
            monthIndex, salesValue, revenueValue,
        });
    }
}