import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { Product } from '../../../../services/models/product.models';
import { CategoryService } from '../../../../services/services/category.service';
import { Category } from '../../../../services/models/category.model';


@Component({
  selector: 'app-basic-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    InputFieldComponent,
    DropzoneComponent,
    DatePickerComponent,
    SelectComponent,
    ButtonComponent,
    SwitchComponent,
  ],
  templateUrl: './basic-section.component.html'
})
export class BasicSectionComponent {
  onExpiryDateChange($event: any) {
    console.log('Date picker change detected:', $event.dateStr);
    this.expiryDate = $event.dateStr;
  }
  expiryDateChange($event: any) {
    console.log('Expiry date changed:', $event);
    this.expiryDate = $event.dateStr;
    this.emit();
  }

  @Output() formChange = new EventEmitter<Product>();
  constructor(private http: HttpClient, private router: Router, private categoryService: CategoryService) { }

  private apiEndPoint = environment.apiUrl;

  private apiUrl = `${this.apiEndPoint}/product`;

  isLoading = false;
  errorMessage = '';
  isActive = true;

  options: any[] = [];

  // setup options for select component, calling get all categories
  setupCategoryOptions() {
    const shopId = localStorage.getItem('selectedShopId');
    this.categoryService.getAllByShop(shopId!).subscribe({
      next: (data) => {
        this.options = data.map((cat) => ({ value: cat._id!, label: cat.name! }));
      },
      error: (err) => this.errorMessage = err?.error?.message ?? 'Failed to load categories.'
    });
  }

  // Form fields
  name = '';
  category: Category = { _id: '', name: '', description: '', isActive: true };
  brand = '';
  sku = '';
  barcode = '';
  model = '';
  description = '';
  costPrice = 0;
  sellingPrice = 0;
  stock = 0;
  expiryDate: string | null = null;
  files: File[] = [];
  objectUrls: string[] = [];


  emit() {
    this.formChange.emit(this.buildPayload());
  }

  handleSelectChange(value: string) {
    this.category = this.options.find(opt => opt.value === value)?.value || null;
  
  }

  buildPayload(): Product {
    return {
      _id: '', // This will be set by the backend
      name: this.name,
      category: this.category as Category,
      brand: this.brand,
      sku: this.sku,
      barcode: this.barcode,
      model: this.model,
      description: this.description,
      costPrice: this.costPrice,
      sellingPrice: this.sellingPrice,
      stock: this.stock,
      expiryDate: this.expiryDate,
      isActive: this.isActive,
      shop: localStorage.getItem("selectedShopId")
    };
  }

  onSave() {

    console.log(this.files)
    
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

    console.log('Submitting product:', payload, 'with files:', this.files);

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value)); // ✅ safely convert
      }
    });

    this.files.forEach(file => formData.append('image', file));

    this.http.post<{ id: string }>(this.apiUrl, formData).subscribe({
      next: (response) => {
        console.log('Product created:', response);
        this.isLoading = false;
        this.onClear();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Something went wrong.';
        this.isLoading = false;
      }
    });
  }

  onClear() {
    this.name = '';
    this.category = { _id: '', name: '', description: '', isActive: true };
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
    this.files = [];
    this.objectUrls.forEach(url => URL.revokeObjectURL(url));
    this.objectUrls = [];
  }
  onFilesDropped(files: File[]) {
    this.objectUrls.forEach(url => URL.revokeObjectURL(url));

    this.files = files;
    this.objectUrls = files.map(file => URL.createObjectURL(file));
    console.log('Files dropped (p):', this.files);
  }
  onSubmit() {

  }

  ngOnInit() {
    this.setupCategoryOptions();
  }
}