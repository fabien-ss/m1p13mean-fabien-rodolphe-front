import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
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
