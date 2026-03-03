import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Shop } from "../models/shop.model";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = `${environment.apiUrl}/shop`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Shop[]> {
    return this.http.get<Shop[]>(this.apiUrl);
  }

  // FormData pour supporter l'upload d'images via multer
  create(formData: FormData): Observable<Shop> {
    return this.http.post<Shop>(this.apiUrl, formData);
    // Ne pas setter Content-Type manuellement — Angular le fait automatiquement
    // avec le bon boundary pour multipart/form-data
  }

  update(id: string, data: Partial<Shop> | FormData): Observable<Shop> {
    return this.http.put<Shop>(`${this.apiUrl}/${id}`, data);
  }

  deactivate(id: string): Observable<Shop> {
    return this.http.patch<Shop>(`${this.apiUrl}/${id}/deactivate`, {});
  }
}