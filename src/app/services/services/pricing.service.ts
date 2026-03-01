import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreatePricing, Pricing } from '../models/princing.model';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private apiUrl = `${environment.apiUrl}/pricing`;

  constructor(private http: HttpClient) {}

  getByProduct(productId: string): Observable<Pricing[]> {
    return this.http.get<Pricing[]>(`${this.apiUrl}/product/${productId}`);
  }

  create(data: CreatePricing): Observable<Pricing> {
    return this.http.post<Pricing>(this.apiUrl, data);
  }
}