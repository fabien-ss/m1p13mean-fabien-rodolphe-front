import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface Product {
    _id: string;
    name: string;
    description?: string;
    devise: string;
    price: number;     // Ajouté pour le commerce
    oldPrice?: number; // Pour les promos
    promo?: boolean;   // Pour le filtrage
    tags?: string[];
    sku?: string;
    barcode?: string;
    stock: number;
    brand?: string;
    images: string[];
    shop: {_id: string};      // ID de la boutique
    available: boolean;
}
@Injectable({ providedIn: 'root' })
export class ProductService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:8888/product';

    getProducts() {
        return this.http.get<Product[]>(this.API_URL);
    }

    getProductById(id: string) {
        return this.http.get<Product>(`${this.API_URL}/${id}`);
    }

    // Pour les produits similaires
    getProductsByShop(shopId: string) {
        return this.http.get<Product[]>(`${this.API_URL}/shop/${shopId}`);
    }

}