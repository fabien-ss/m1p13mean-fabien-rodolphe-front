import { Component } from '@angular/core';
import { TableDropdownComponent } from '../../../../shared/components/common/table-dropdown/table-dropdown.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { Router } from '@angular/router';
import { Shop } from '../../../../services/models/shop.model';
import { ShopService } from '../../../../services/services/shop.service';
import { ShopEditComponent } from '../../pages/shop-edit/shop-edit.component';
import { ShopNewComponent } from '../../pages/shop-new/shop-new.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-shop-selection',
  standalone: true,
  imports: [
    TableDropdownComponent,
    ButtonComponent,
    ModalComponent,
    ShopNewComponent,
    ShopEditComponent,
  ],
  templateUrl: './shop-selection.component.html',
  styleUrl: './shop-selection.component.css',
})
export class ShopSelectionComponent {

  constructor(private shopService: ShopService, private router: Router) {}

  apiEndpoint = environment.apiUrl;

  isLoading = false;
  errorMessage = '';

  shops: Shop[] = [];
  selectedShop: Shop | null = null;

  // Modal states
  isCreateModalOpen = false;
  isEditModalOpen = false;

  currentUserRole = localStorage.getItem('currentUserRole') || '';

  boxIcon = `
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none"
        xmlns="http://www.w3.org/2000/svg" class="size-5">
      <path d="M7 5L12 10L7 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"/>
    </svg>
  `;

  plusIcon = `
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none"
        xmlns="http://www.w3.org/2000/svg" class="size-4">
      <path d="M10 4v12M4 10h12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"/>
    </svg>
  `;

  // --- Modal controls ---
  openCreateModal() { this.isCreateModalOpen = true; }
  closeCreateModal() { this.isCreateModalOpen = false; }

  openEditModal(shop: Shop) {
    this.selectedShop = shop;
    this.isEditModalOpen = true;
  }
  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedShop = null;
  }

  // --- Callbacks depuis les composants enfants ---
  onShopCreated(shop: Shop) {
    this.shops = [shop, ...this.shops];
    this.closeCreateModal();
  }

  onShopUpdated(updatedShop: Shop) {
    this.shops = this.shops.map(s => s._id === updatedShop._id ? updatedShop : s);
    this.closeEditModal();
  }

  // --- Actions dropdown par shop ---
  handleEdit(shop: Shop) { this.openEditModal(shop); }

  handleDelete(shop: Shop) {
    if (!confirm(`Deactivate "${shop.name}"?`)) return;
    this.shopService.deactivate(shop._id).subscribe({
      next: (updated) => {
        this.shops = this.shops.map(s => s._id === updated._id ? updated : s);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to deactivate shop.';
      }
    });
  }

  goToView(shop: Shop) {
    localStorage.setItem('selectedShop', shop.name);
    localStorage.setItem('selectedShopId', shop._id);
    this.router.navigate(['/admin-shop/view']);
  }

  fetchShops(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.shopService.getAll().subscribe({
      next: (data) => {
        this.shops = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to load shops.';
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.fetchShops();
  }
}