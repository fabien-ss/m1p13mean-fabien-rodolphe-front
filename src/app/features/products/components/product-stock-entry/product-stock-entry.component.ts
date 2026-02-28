import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../services/models/product.models';
import { MovementService } from '../../../../services/services/movement.service';

@Component({
  selector: 'app-product-stock-entry',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-stock-entry.component.html',
  styleUrl: './product-stock-entry.component.css',
})
export class ProductStockEntryComponent {

  @Input() product: Product | null = null;
  @Output() saved = new EventEmitter<void>();

  costPrice: number | null = null;
  sellingPrice: number | null = null;
  quantity: number | null = null;
  expiryDate: string = '';
  reason: string = '';
  isLoading = false;
  errorMessage = '';

  constructor(private movementService: MovementService) {}

  onSaveEntry() {
    if (!this.product?._id) { this.errorMessage = 'No product selected.'; return; }
    if (!this.quantity || this.quantity <= 0) { this.errorMessage = 'Quantity must be greater than 0.'; return; }

    alert("Saving stock entry..."); // Debug alert

    this.isLoading = true;
    this.movementService.createStockEntry({
      product: this.product._id,
      quantity: this.quantity,
      costPrice: this.costPrice,
      sellingPrice: this.sellingPrice,
      expiryDate: this.expiryDate || null,
      reason: this.reason
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.saved.emit(); // notify parent to refresh
        this.clear();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to save entry.';
        this.isLoading = false;
      }
    });
  }

  clear() {
    this.costPrice = null;
    this.sellingPrice = null;
    this.quantity = null;
    this.expiryDate = '';
    this.reason = '';
    this.errorMessage = '';
  }
}