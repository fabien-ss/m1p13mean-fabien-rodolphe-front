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
