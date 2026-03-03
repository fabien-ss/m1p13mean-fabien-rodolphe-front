import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface Shop {
  _id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  images: string[];
  type?: string;
  rating?: number;
  isActive: boolean;
  location?: string; // Ajouté pour l'UI
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  private http = inject(HttpClient);
  private apiEndpoint = environment.apiUrl;
  private readonly API_URL = `${this.apiEndpoint}/shop`;

  getShops() {
    return this.http.get<Shop[]>(`${this.API_URL}/list`);
  }

  getShopById(id: string) {
    return this.http.get<Shop>(`${this.API_URL}/${id}`);
  }

  getFeaturedShops() {
    return this.http.get<Shop[]>(`${this.API_URL}/featured`);
  }
}