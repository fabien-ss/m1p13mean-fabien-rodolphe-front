// services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrdersByShop(shopId: string, startDate: string, endDate: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/shop/${shopId}?startDate=${startDate}&endDate=${endDate}`);
  }
}