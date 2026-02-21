import { Component } from '@angular/core';

export interface StockMovement {
  id: string;
  type: 'in' | 'out';
  product: { name: string; sku: string; image: string; };
  quantity: number;
  costPrice?: number;
  sellingPrice?: number;
  expiryDate?: string;
  date: string;
  note?: string;
}

@Component({
  selector: 'app-product-movements',
  imports: [],
  templateUrl: './product-movements.component.html',
  styleUrl: './product-movements.component.css',
})
export class ProductMovementsComponent {
  filterType: 'all' | 'in' | 'out' = 'all';

  movements: StockMovement[] = [
    {
      id: '1', type: 'in',
      product: { name: 'Dell Laptop', sku: 'WNC-HP-001', image: 'https://i.dell.com/...' },
      quantity: 50, costPrice: 2500, sellingPrice: 3000,
      expiryDate: '', date: '2026-02-20', note: 'Initial stock'
    },
    {
      id: '2', type: 'out',
      product: { name: 'Dell Laptop', sku: 'WNC-HP-001', image: 'https://i.dell.com/...' },
      quantity: 3, date: '2026-02-21', note: 'Customer order #1042'
    },
  ];

  get filteredMovements(): StockMovement[] {
    if (this.filterType === 'all') return this.movements;
    return this.movements.filter(m => m.type === this.filterType);
  }
}
