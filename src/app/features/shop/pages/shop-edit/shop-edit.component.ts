import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ShopService } from '../../../../services/services/shop.service';
import { Shop } from '../../../../services/models/shop.model';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../../shared/components/form/input/input-field.component';
import { DropzoneComponent } from '../../../../shared/components/form/form-elements/dropzone/dropzone.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';

@Component({
  selector: 'app-shop-edit',
  standalone: true,
  imports: [
    FormsModule,
    LabelComponent,
    InputFieldComponent,
    DropzoneComponent,
    SwitchComponent,
    ButtonComponent,
  ],
  templateUrl: './shop-edit.component.html',
})
export class ShopEditComponent implements OnChanges {

  @Input() shop!: Shop;
  @Output() shopUpdated = new EventEmitter<Shop>();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shop'] && this.shop) {
      this.populateFields();
    }
  }

  private populateFields(): void {
    this.name         = this.shop.name ?? '';
    this.email        = this.shop.email ?? '';
    this.phone        = this.shop.phone ?? '';
    this.description  = this.shop.description ?? '';
    this.typeList     = this.shop.type
                          ? this.shop.type.split(',').map(t => t.trim()).filter(Boolean)
                          : [];
    this.typeInput    = '';
    this.isActive     = this.shop.isActive ?? false;
    this.managerEmail = '';
    this.files        = [];
    this.errorMessage = '';
  }

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

  onReset() {
    this.populateFields();
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
    return true;
  }

  onSave() {
    this.errorMessage = '';
    if (!this.isValid()) return;

    this.isLoading = true;

    const formData = new FormData();
    formData.append('name',        this.name);
    formData.append('email',       this.email);
    formData.append('phone',       this.phone);
    formData.append('description', this.description);
    formData.append('type',        this.typeList.join(', '));
    formData.append('isActive',    String(this.isActive));

    // Manager uniquement si changement
    if (this.managerEmail.trim()) {
      formData.append('manager', this.managerEmail);
    }

    // Nouveaux fichiers uniquement si l'admin en a déposé
    this.files.forEach(file => formData.append('image', file));

    this.shopService.update(this.shop._id, formData).subscribe({
      next: (updatedShop) => {
        this.isLoading = false;
        this.shopUpdated.emit(updatedShop);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? 'Failed to update shop.';
      }
    });
  }
}