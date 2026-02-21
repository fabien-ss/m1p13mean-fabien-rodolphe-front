import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../../shared/components/form/input/input-field.component';
import { DropzoneComponent } from '../../../../shared/components/form/form-elements/dropzone/dropzone.component';
import { TextAreaComponent } from '../../../../shared/components/form/input/text-area.component';
import { DatePickerComponent } from '../../../../shared/components/form/date-picker/date-picker.component';
import { SelectComponent } from '../../../../shared/components/form/select/select.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { LabelComponent as AppLabel } from '../../../../shared/components/form/label/label.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

export interface BasicSectionData {
  name: string;
  category: string;
  brand: string;
  sku: string;
  barcode: string;
  model: string;
  description: string;
  price: number;
  sellingPrice: number;
  stock: number;
  expiryDate: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-basic-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    InputFieldComponent,
    DropzoneComponent,
    TextAreaComponent,
    DatePickerComponent,
    SelectComponent,
    ButtonComponent,
    SwitchComponent,
  ],
  templateUrl: './basic-section.component.html'
})
export class BasicSectionComponent {

  @Output() formChange = new EventEmitter<BasicSectionData>();

  private apiEndPoint = environment.apiUrl;

  private apiUrl = `${this.apiEndPoint}/product`;

  isLoading = false;
  errorMessage = '';
  isActive = true;

  options = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'clothing', label: 'Clothing' },
  ];

  // Form fields
  name = '';
  category = '';
  brand = '';
  sku = '';
  barcode = '';
  model = '';
  description = '';
  costPrice = 0;
  sellingPrice = 0;
  stock = 0;
  expiryDate: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  emit() {
    this.formChange.emit(this.buildPayload());
  }

  handleSelectChange(value: string) {
    this.category = value;
    this.emit();
  }

  buildPayload(): BasicSectionData {
    return {
      name: this.name,
      category: this.category,
      brand: this.brand,
      sku: this.sku,
      barcode: this.barcode,
      model: this.model,
      description: this.description,
      price: this.costPrice,
      sellingPrice: this.sellingPrice,
      stock: this.stock,
      expiryDate: this.expiryDate,
      isActive: this.isActive,
    };
  }

  onSave() {
    this.errorMessage = '';
  
    // Validate required fields
    if (!this.name.trim()) {
      this.errorMessage = 'Product Name is required.';
      return;
    }
    if (!this.category) {
      this.errorMessage = 'Category is required.';
      return;
    }
    if (!this.sku.trim()) {
      this.errorMessage = 'SKU is required.';
      return;
    }
    if (!this.description.trim()) {
      this.errorMessage = 'Description is required.';
      return;
    }
    if (!this.costPrice || this.costPrice <= 0) {
      this.errorMessage = 'Cost Price is required and must be greater than 0.';
      return;
    }
    if (!this.sellingPrice || this.sellingPrice <= 0) {
      this.errorMessage = 'Selling Price is required and must be greater than 0.';
      return;
    }
    if (this.stock === null || this.stock === undefined || this.stock < 0) {
      this.errorMessage = 'Opening Stock is required and cannot be negative.';
      return;
    }
  
    this.isLoading = true;
  
    const payload = this.buildPayload();
    console.log('Payload:', payload);
  
    this.http.post<{ id: string }>(this.apiUrl, payload).subscribe({
      next: (response) => {
        console.log('Product created:', response);
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Something went wrong.';
        this.isLoading = false;
      }
    });
  }

  onClear() {
    this.name = '';
    this.category = '';
    this.brand = '';
    this.sku = '';
    this.barcode = '';
    this.model = '';
    this.description = '';
    this.costPrice = 0;
    this.sellingPrice = 0;
    this.stock = 0;
    this.expiryDate = null;
    this.isActive = true;
    this.errorMessage = '';
  }
}