// services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientSuggestion, CreateOrderPayload, Order, OrderClientInterface, ShopProduct } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private api = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  getOrdersByShop(shopId: string, startDate?: string, endDate?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<Order[]>(`${this.api}/shop/${shopId}`, { params });
  }

  // get commandes d'un client
  getOrdersByClient(clientId: string): Observable<OrderClientInterface[]> {
    return this.http.get<OrderClientInterface[]>(`${this.api}/client/${clientId}`);
  }

  getShopProducts(shopId: string): Observable<ShopProduct[]> {
    return this.http.get<ShopProduct[]>(`${this.api}/shop/${shopId}/products`);
  }

  searchClients(query: string): Observable<ClientSuggestion[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ClientSuggestion[]>(`${this.api}/clients/search`, { params });
  }

  createOrder(payload: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(this.api, payload);
  }

  updateOrderStatus(orderId: string, status: string): Observable<{ id: string; status: string }> {
    return this.http.put<{ id: string; status: string }>(
      `${this.api}/${orderId}/status`,
      { status }
    );
  }
}