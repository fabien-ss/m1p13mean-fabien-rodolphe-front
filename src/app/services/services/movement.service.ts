import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Movement } from '../models/movement.models';
import { StockEntry } from '../models/stock-movement.model';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private apiUrl = `${environment.apiUrl}/movement`;

  constructor(private http: HttpClient) {}

  getByShop(shopId: string, type: 'all' | 'in' | 'out' = 'all'): Observable<Movement[]> {
    return this.http.get<any[]>(`${this.apiUrl}/shop/${shopId}`, { params: { type } }).pipe(
      map(data => data.map(m => ({
        ...m,
        product: {
          ...m.product,
          image: m.product?.images?.[0] ?? '/images/placeholder.jpg'
        },
        note: m.reason // backend uses "reason", template uses "note"
      })))
    );
  }

  getByProduct(productId: string, type: 'all' | 'in' | 'out' = 'all'): Observable<Movement[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/${productId}`, { params: { type } }).pipe(
      map(data => data.map(m => ({
        ...m,
        product: {
          ...m.product,
          image: m.product?.images?.[0] ?? '/images/placeholder.jpg'
        },
        note: m.reason
      })))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  

  createStockEntry(data: StockEntry): Observable<Movement> {
    return this.http.post<Movement>(`${this.apiUrl}/stock-entry`, data);
}
}