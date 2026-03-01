import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MetricItem {
  total: number;
  variation: number;
  trend: 'up' | 'down';
}

export interface OverviewMetrics {
  revenue: MetricItem;
  orders: MetricItem;
  customers: MetricItem;
  activeShops: MetricItem;
}

export interface ChartData {
  categories: string[];
  series: { name: string; data: number[] }[];
}

export interface TopShop {
  _id: string;
  name: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface ShopOption {
  _id: string;
  name: string;
  isActive: boolean;
}

export interface AdminDashboardData {
  overview: OverviewMetrics;
  revenuePerShop: ChartData;
  ordersOverTime: ChartData;
  topShops: TopShop[];
  monthlySalesComparison: ChartData;
  allShops: ShopOption[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class AdminStatsService {
  private apiUrl = `${environment.apiUrl}/admin/stats`;

  constructor(private http: HttpClient) {}

  getDashboardData(shopId?: string): Observable<ApiResponse<AdminDashboardData>> {
    const params = shopId ? `?shopId=${shopId}` : '';
    return this.http.get<ApiResponse<AdminDashboardData>>(`${this.apiUrl}/dashboard${params}`);
  }
}