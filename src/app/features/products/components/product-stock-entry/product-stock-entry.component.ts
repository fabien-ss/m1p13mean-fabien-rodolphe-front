import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-stock-entry',
  imports: [
    FormsModule
  ],
  templateUrl: './product-stock-entry.component.html',
  styleUrl: './product-stock-entry.component.css',
})
export class ProductStockEntryComponent {
  costPrice: number | null = null;
  sellingPrice: number | null = null;
  quantity: number | null = null;
  expiryDate: string = '';
  
  onSaveEntry() {
    const payload = {
      costPrice: this.costPrice,
      sellingPrice: this.sellingPrice,
      quantity: this.quantity,
      expiryDate: this.expiryDate || null,
    };
    console.log('Stock entry payload:', payload);
  }
}
