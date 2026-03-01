// product-edit-drawer.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { InputFieldComponent } from '../../../../shared/components/form/input/input-field.component';
import { TextAreaComponent } from '../../../../shared/components/form/input/text-area.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../../shared/components/form/select/select.component';
import { ProductService } from '../../../../services/services/product.service';
import { CategoryService } from '../../../../services/services/category.service';
import { Product } from '../../../../services/models/product.models';
import { Category } from '../../../../services/models/category.model';

@Component({
  selector: 'app-product-edit-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    SwitchComponent,
    InputFieldComponent,
    TextAreaComponent,
    LabelComponent,
    SelectComponent,
  ],
  templateUrl: './product-edit-drawer.component.html',
})
export class ProductEditDrawerComponent implements OnChanges {

  @Input()  product: Product | null = null;
  @Input()  isOpen  = false;
  @Output() close   = new EventEmitter<void>();
  @Output() saved   = new EventEmitter<Product>();   // emits the updated product

  // Draft (local copy of the product being edited)
  draft: Partial<Product> = {};

  isLoading     = signal(false);
  errorMessage  = '';
  successMessage = '';

  // cCategory options
  categoryOptions: { value: string; label: string }[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.draft = {
        name:        this.product.name        ?? '',
        brand:       this.product.brand       ?? '',
        model:       this.product.model       ?? '',
        description: this.product.description ?? '',
        price:       this.product.price       ?? 0,
        devise:      this.product.devise      ?? 'MGA',
        stock:       this.product.stock       ?? 0,
        minStock:    this.product.minStock    ?? 0,
        sku:         this.product.sku         ?? '',
        barcode:     this.product.barcode     ?? '',
        available:   this.product.available   ?? false,
        tags:        [...(this.product.tags   ?? [])],
        category:    this.product.category,
      };
      this.clearMessages();
      this.loadCategories();
    }
  }

  // Load categories for the select

  private loadCategories(): void {
    const shopId = localStorage.getItem('selectedShopId');
    if (!shopId) return;

    this.categoryService.getAllByShop(shopId).subscribe({
      next: (cats: Category[]) => {
        this.categoryOptions = cats.map(c => ({ value: c._id, label: c.name }));
      }
    });
  }

  tagInput = '';

  addTag(): void {
    const tag = this.tagInput.trim().toLowerCase();
    if (!tag) return;
    if (!(this.draft.tags ?? []).includes(tag)) {
      this.draft.tags = [...(this.draft.tags ?? []), tag];
    }
    this.tagInput = '';
  }

  removeTag(tag: string): void {
    this.draft.tags = (this.draft.tags ?? []).filter(t => t !== tag);
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') { event.preventDefault(); this.addTag(); }
  }

  onCategoryChange(id: string): void {
    // Keep the full Category object shape so the table renders cat.name
    const found = this.categoryOptions.find(o => o.value === id);
    this.draft.category = found
      ? { _id: id, name: found.label, isActive: true }
      : undefined;
  }

  get selectedCategoryId(): string {
    return (this.draft.category as Category)?._id ?? '';
  }

  onSave(): void {
    if (!this.product?._id) return;
    if (!this.validate()) return;

    this.isLoading.set(true);
    this.clearMessages();

    const payload: Partial<Product> = {
      name:        this.draft.name,
      brand:       this.draft.brand,
      model:       this.draft.model,
      description: this.draft.description,
      price:       Number(this.draft.price),
      devise:      this.draft.devise,
      stock:       Number(this.draft.stock),
      minStock:    Number(this.draft.minStock),
      sku:         this.draft.sku,
      barcode:     this.draft.barcode,
      available:   this.draft.available,
      tags:        this.draft.tags,
      // Send only the category _id to the API
      category:    this.draft.category
                     ? { _id: (this.draft.category as Category)._id } as any
                     : null,
    };

    this.productService.update(this.product._id, payload).subscribe({
      next: (updated) => {
        this.isLoading.set(false);
        this.showSuccess('Product updated successfully.');
        this.saved.emit(updated);
        // Auto-close after a short delay so user sees the success message
        setTimeout(() => this.onClose(), 1200);
      },
      error: (err) => this.handleError(err, 'Failed to update product.')
    });
  }

  onClose(): void {
    this.clearMessages();
    this.close.emit();
  }

  private validate(): boolean {
    this.clearMessages();
    if (!this.draft.name?.trim()) {
      this.errorMessage = 'Product name is required.';
      return false;
    }
    if (Number(this.draft.price) < 0) {
      this.errorMessage = 'Price must be a positive number.';
      return false;
    }
    return true;
  }

  private clearMessages(): void {
    this.errorMessage  = '';
    this.successMessage = '';
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
  }

  private handleError(err: any, fallback: string): void {
    this.errorMessage = err?.error?.message ?? fallback;
    this.isLoading.set(false);
  }
}