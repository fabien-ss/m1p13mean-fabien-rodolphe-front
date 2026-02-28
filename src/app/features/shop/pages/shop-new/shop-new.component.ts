import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ShopService } from '../../../../services/services/shop.service';
import { Shop } from '../../../../services/models/shop.model';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../../shared/components/form/input/input-field.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { DropzoneComponent } from '../../../../shared/components/form/form-elements/dropzone/dropzone.component';

@Component({
  selector: 'app-shop-new',
  standalone: true,
  imports: [
    FormsModule,
    LabelComponent,
    InputFieldComponent,
    DropzoneComponent,
    SwitchComponent,
    ButtonComponent,
  ],
  templateUrl: './shop-new.component.html'
})
export class ShopNewComponent {

  @Output() shopCreated = new EventEmitter<Shop>();

  // Fields
  name = '';
  email = '';
  phone = '';
  description = '';
  typeList: string[] = [];
  typeInput = '';
  managerEmail = '';
  isActive = false;
  files: File[] = [];

  // State
  isLoading = false;
  errorMessage = '';

  constructor(private shopService: ShopService) {}

  emit() {}

  addType() {
    const val = this.typeInput.trim();
    if (val && !this.typeList.includes(val)) {
      this.typeList = [...this.typeList, val];
    }
    this.typeInput = '';
  }

  removeType(t: string) {
    this.typeList = this.typeList.filter(item => item !== t);
  }

  onFilesDropped(files: File[]) {
    this.files = files;
  }

  onClear() {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.description = '';
    this.typeList = [];
    this.typeInput = '';
    this.managerEmail = '';
    this.isActive = false;
    this.files = [];
    this.errorMessage = '';
  }

  private isValid(): boolean {
    if (!this.name.trim()) {
      this.errorMessage = 'Shop name is required.';
      return false;
    }
    if (!this.email.trim()) {
      this.errorMessage = 'Email is required.';
      return false;
    }
    if (!this.managerEmail.trim()) {
      this.errorMessage = 'Manager email is required.';
      return false;
    }
    return true;
  }

  onSave() {
    this.errorMessage = '';

    // Validation fichiers
    if (this.files.length === 0) {
      this.errorMessage = 'At least one image is required.';
      return;
    }
    if (this.files.length > 5) {
      this.errorMessage = 'You can upload a maximum of 5 images.';
      return;
    }

    // Validation champs
    if (!this.isValid()) return;

    this.isLoading = true;

    const formData = new FormData();
    formData.append('name',        this.name);
    formData.append('email',       this.email);
    formData.append('phone',       this.phone);
    formData.append('description', this.description);
    formData.append('type',        this.typeList.join(', '));
    formData.append('isActive',    String(this.isActive));
    formData.append('manager',     this.managerEmail);

    this.files.forEach(file => formData.append('image', file));

    this.shopService.create(formData).subscribe({
      next: (shop) => {
        this.isLoading = false;
        this.shopCreated.emit(shop);
        this.onClear();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? 'Failed to create shop.';
      }
    });
  }
}