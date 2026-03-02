import { OrderService } from '@/services/services/order.service';
import { Injectable, signal, computed, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateOrderPayload } from '@/services/models/order.model';
import { OrderItem } from '@/services/models/order.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private _items = signal<CartItem[]>(this.loadFromStorage());

  items = this._items.asReadonly();
  count = computed(() => this._items().reduce((acc, item) => acc + item.qty, 0));
  total = computed(() => this._items().reduce((acc, item) => acc + (item.price * item.qty), 0));

  constructor() {
    // Persistance automatique
    if (typeof window !== 'undefined') {
      localStorage.setItem('mall_cart', JSON.stringify(this._items()));
    }
  }

  makeOrder(): Observable<any> | undefined {
    const user = this.authService.getUser();
    if (!user) {
      console.error('User not logged in');
      return undefined;
    }

    const orderData: CreateOrderPayload = {
      clientId: user?.id || '',
      items: this._items().map(item => ({
        produitId: item.id.toString(),
        quantite: item.qty,
        prix: item.price
      }))
    };

    return this.orderService.createOrder(orderData);
  }

  clearCart() {
    this._items.set([]);
    this.saveToStorage([]);
  }

  getCartItems(): CartItem[] {
    return this.loadFromStorage();
  }

  addToCart(product: any, qty: number = 1) {
    this._items.update(prev => {
      const existing = prev.find(i => i.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      } else {
        updated = [...prev, { id: product.id, name: product.name, price: product.price, qty, image: product.image }];
      }
      this.saveToStorage(updated);
      return updated;
    });
  }

  remove(productId: number) {
    this._items.update(prev => {
      const updated = prev.filter(i => i.id !== productId);
      this.saveToStorage(updated);
      return updated;
    });
  }

  private saveToStorage(items: CartItem[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mall_cart', JSON.stringify(items));
    }
  }

  private loadFromStorage(): CartItem[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mall_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  }
}
