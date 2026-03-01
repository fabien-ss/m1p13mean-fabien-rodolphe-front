// service to implement promotion create
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Promotion } from '../models/promotion.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = `${environment.apiUrl}/promotion`;

  constructor(private http: HttpClient) {}

  create(data: Partial<Promotion>): Observable<Promotion> {
    return this.http.post<Promotion>(this.apiUrl, data);
  }
}