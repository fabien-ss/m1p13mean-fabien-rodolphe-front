import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../services/models/product.models';
import { PricingService } from '../../../../services/services/pricing.service';
import { DatePickerComponent } from '../../../../shared/components/form/date-picker/date-picker.component';
import { CreatePricing } from '../../../../services/models/princing.model';

@Component({
  selector: 'app-product-avancement',
  imports: [FormsModule,
        DatePickerComponent,
  ],
  templateUrl: './product-avancement.component.html',
  styleUrl: './product-avancement.component.css',
})
export class ProductAvancementComponent {

  @Input() product: Product | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  priceType: 'standard' | 'promotion' = 'standard';
  newPrice: number | null = null;
  startDate: string = '';
  promoEndDate: string = '';
  priceNote: string = '';
  isLoading = false;
  errorMessage = '';

  constructor(private pricingService: PricingService) { }

  updateStartDate($event: any) {
    console.log('Start date changed:', $event);
    this.startDate = $event.dateStr;
  }

  updatePromoEndDate($event: any) {
    console.log('Promotion end date changed:', $event);
    this.promoEndDate = $event.dateStr;
  }

  onUpdatePrice() {
    if (!this.product?._id) { this.errorMessage = 'No product selected.'; return; }
    if (!this.newPrice || this.newPrice <= 0) { this.errorMessage = 'Price must be greater than 0.'; return; }
    if (this.priceType === 'promotion' && !this.promoEndDate) { this.errorMessage = 'End date is required for a promotion.'; return; }

    const princingData:CreatePricing = {
      product: this.product._id,
      sellingPrice: this.newPrice,
      startDate: this.startDate || null,
      endDate: this.priceType === 'promotion' ? this.promoEndDate : null,
      note: this.priceNote || null
    };
    console.log('Creating pricing with data:', princingData); // Debug log

    
    this.isLoading = true;
    this.pricingService.create({
      product: this.product._id,
      sellingPrice: this.newPrice,
      startDate: this.startDate || null,
      endDate: this.priceType === 'promotion' ? this.promoEndDate : null,
      note: this.priceNote || null
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.saved.emit();
        this.clear();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to update price.';
        this.isLoading = false;
      }
    }); 
  }

  clear() {
    this.newPrice = null;
    this.startDate = '';
    this.promoEndDate = '';
    this.priceNote = '';
    this.errorMessage = '';
  }

  close(){
    this.cancel.emit();
  }
}