import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '../../../../shared/components/form/date-picker/date-picker.component';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  sku: string;
  category: string;
  subCategory?: string;

  price: number;
  compareAtPrice?: number;       // original price before discount
  currency: string;              // e.g. 'USD'

  promotion?: {
    promotionalPrice: number;
    startDate: string;
    endDate?: string;            // null = no end date
    note?: string;
  };

  stock: number;
  lowStockThreshold: number;
  status: 'Available' | 'Out of Stock' | 'Low Stock' | 'Discontinued';

  variants?: {
    id: string;
    name: string;                // e.g. 'Size', 'Color'
    options: string[];           // e.g. ['S', 'M', 'L']
  }[];

  weight?: number;               // for shipping
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };

  tags?: string[];
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
@Component({
  selector: 'app-product-avancement',
  imports: [FormsModule, DatePickerComponent],
  templateUrl: './product-avancement.component.html',
  styleUrl: './product-avancement.component.css',
})
export class ProductAvancementComponent {

  product: Product = {
    id: 'prod_001',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation.',
    image: 'https://example.com/images/headphones.jpg',
    sku: 'WNC-HP-001',
    category: 'Electronics',
    subCategory: 'Audio',
  
    price: 149.99,
    compareAtPrice: 199.99,
    currency: 'USD',
  
    promotion: {
      promotionalPrice: 119.99,
      startDate: '2026-02-01',
      endDate: '2026-03-01',
      note: 'Winter sale',
    },
  
    stock: 42,
    lowStockThreshold: 10,
    status: 'Available',
  
    variants: [
      { id: 'var_001', name: 'Color', options: ['Black', 'White', 'Midnight Blue'] },
    ],
  
    weight: 250,
    dimensions: { length: 20, width: 18, height: 8, unit: 'cm' },
  
    tags: ['wireless', 'noise-cancelling', 'premium'],
    isActive: true,
  
    createdAt: '2025-11-10T08:00:00Z',
    updatedAt: '2026-02-15T12:30:00Z',
  };

  priceType: 'standard' | 'promotion' = 'promotion';
  newPrice: number | null = null;
  actualPrice: number | null = 2500;
  promoStartDate: string = '';
  promoEndDate: string = '';
  priceNote: string = '';
  
  startDate: string = '';


  onUpdatePrice() {
    const payload = {
      type: this.priceType,
      price: this.newPrice,
      ...(this.priceType === 'promotion' && {
        startDate: this.promoStartDate,
        endDate: this.promoEndDate || null,
      }),
      note: this.priceNote || null,
    };
    console.log('Price update payload:', payload);
  }
}
