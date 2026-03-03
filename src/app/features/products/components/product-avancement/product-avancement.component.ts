// product-avancement.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../services/models/product.models';
import { PricingService } from '../../../../services/services/pricing.service';
import { PromotionService } from '../../../../services/services/promotion.service';
import { DatePickerComponent } from '../../../../shared/components/form/date-picker/date-picker.component';
import { CreatePricing } from '../../../../services/models/princing.model';
import { Promotion } from '../../../../services/models/promotion.model';

@Component({
  selector: 'app-product-avancement',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent],
  templateUrl: './product-avancement.component.html',
  styleUrl: './product-avancement.component.css',
})
export class ProductAvancementComponent {

  @Input() product: Product | null = null;
  @Output() saved  = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  priceType: 'standard' | 'promotion' = 'standard';
  isLoading    = false;
  errorMessage = '';

  // ── Standard pricing fields ───────────────────────────────────────────
  newPrice:  number | null = null;
  startDate: string = '';
  priceNote: string = '';

  // ── Promotion-specific fields ─────────────────────────────────────────
  promoTitle:        string            = '';
  promoDescription:  string            = '';
  promoDiscountType: 'PERCENT'|'FIXED' = 'PERCENT';
  promoValue:        number | null     = null;
  promoStartDate:    string            = '';
  promoEndDate:      string            = '';

  // Live discounted price preview shown in the HTML
  get previewPrice(): number | null {
    if (!this.product?.price || !this.promoValue) return null;
    const base = Number(this.product.price);
    if (this.promoDiscountType === 'PERCENT') {
      return Math.max(0, base * (1 - this.promoValue / 100));
    }
    return Math.max(0, base - this.promoValue);
  }

  constructor(
    private pricingService: PricingService,
    private promotionService: PromotionService,
  ) {}

  // ── Date handlers ─────────────────────────────────────────────────────

  updateStartDate(e: any): void      { this.startDate      = e.dateStr; }
  updatePromoStartDate(e: any): void { this.promoStartDate = e.dateStr; }
  updatePromoEndDate(e: any): void   { this.promoEndDate   = e.dateStr; }

  // ── Called when the radio changes ─────────────────────────────────────

  onTypeChange(): void {
    this.errorMessage = '';
  }

  // ── Main submit dispatcher ────────────────────────────────────────────

  onUpdatePrice(): void {
    this.errorMessage = '';
    if (!this.product?._id) { this.errorMessage = 'No product selected.'; return; }

    if (this.priceType === 'standard') {
      this.submitStandardPrice();
    } else {
      this.submitPromotion();
    }
  }

  // ── Standard price ────────────────────────────────────────────────────

  private submitStandardPrice(): void {
    if (!this.newPrice || this.newPrice <= 0) {
      this.errorMessage = 'Price must be greater than 0.';
      return;
    }

    const payload: CreatePricing = {
      product:      this.product!._id,
      sellingPrice: this.newPrice,
      startDate:    this.startDate || null,
      endDate:      null,
      note:         this.priceNote || null,
    };

    this.isLoading = true;
    this.pricingService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.saved.emit();
        this.clear();
      },
      error: (err) => this.handleError(err, 'Failed to update price.')
    });
  }

  // ── Promotion ─────────────────────────────────────────────────────────

  private submitPromotion(): void {
    if (!this.promoTitle.trim()) {
      this.errorMessage = 'Promotion title is required.';
      return;
    }
    if (!this.promoValue || this.promoValue <= 0) {
      this.errorMessage = 'Discount value must be greater than 0.';
      return;
    }
    if (this.promoDiscountType === 'PERCENT' && this.promoValue > 100) {
      this.errorMessage = 'Percentage discount cannot exceed 100%.';
      return;
    }
    if (!this.promoStartDate) {
      this.errorMessage = 'Promotion start date is required.';
      return;
    }

    const payload: Partial<Promotion> = {
      product:      this.product!._id,
      title:        this.promoTitle.trim(),
      description:  this.promoDescription.trim() || undefined,
      discountType: this.promoDiscountType,
      value:        this.promoValue,
      startDate:    this.promoStartDate,
      endDate:      this.promoEndDate || null,
      createdBy:    localStorage.getItem('userId') ?? '',
    };

    this.isLoading = true;
    this.promotionService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.saved.emit();
        this.clear();
      },
      error: (err) => this.handleError(err, 'Failed to create promotion.')
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────

  clear(): void {
    // Standard
    this.newPrice  = null;
    this.startDate = '';
    this.priceNote = '';
    // Promotion
    this.promoTitle        = '';
    this.promoDescription  = '';
    this.promoDiscountType = 'PERCENT';
    this.promoValue        = null;
    this.promoStartDate    = '';
    this.promoEndDate      = '';
    this.errorMessage      = '';
  }

  close(): void {
    this.cancel.emit();
  }

  private handleError(err: any, fallback: string): void {
    this.errorMessage = err?.error?.message ?? fallback;
    this.isLoading = false;
  }
}