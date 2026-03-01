import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
    discountPercent?: number; // Calculé côté back pour éviter les erreurs de calcul dans le front
    discountAmount?: number;
    images: string[];
    shop: { _id: string };      // ID de la boutique
    available: boolean;
}
@Injectable({ providedIn: 'root' })
export class ProductService {

    private apiEndpoint = environment.apiUrl;
    private http = inject(HttpClient);
    private readonly API_URL = `${this.apiEndpoint}/product`;

    getProducts() {
        return this.http.get<Product[]>(this.API_URL);
    }

    getProductsList() {
        return this.http.get<Product[]>(`${this.API_URL}/list`);
    }

    getProductById(id: string) {
        return this.http.get<Product>(`${this.API_URL}/client/${id}`);
    }

    getHotDeals() {
        return this.http.get<Product[]>(`${this.API_URL}/hot-deals`);
    }

    // Pour les produits similaires
    getProductsByShop(shopId: string) {
        return this.http.get<Product[]>(`${this.API_URL}/shop/${shopId}`);
    }

    searchProducts(params: any): Observable<any> {
        const query = new HttpParams({ fromObject: this.cleanParams(params) });
        return this.http.get(`${this.API_URL}/search`, { params: query });
    }

    getFilterMetadata(): Observable<any> {
        return this.http.get(`${this.API_URL}/filters`);
    }

    private cleanParams(obj: any): any {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== '')
        );
    }

}