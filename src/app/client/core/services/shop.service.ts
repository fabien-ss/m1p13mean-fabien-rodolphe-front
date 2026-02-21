import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Shop {
  _id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  images: string[];
  type?: string;
  isActive: boolean;
  location?: string; // Ajouté pour l'UI
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8888/shop';

  getShops() {
    return this.http.get<Shop[]>(this.API_URL);
  }

  getShopById(id: string) {
    return this.http.get<Shop>(`${this.API_URL}/${id}`);
  }

  getFeaturedShops() {
    return this.http.get<Shop[]>(`${this.API_URL}/featured`);
  }
}