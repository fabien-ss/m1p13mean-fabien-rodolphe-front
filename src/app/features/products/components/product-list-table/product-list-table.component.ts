// product-list-table.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { ProductAvancementComponent } from '../product-avancement/product-avancement.component';
import { ProductStockEntryComponent } from '../product-stock-entry/product-stock-entry.component';
import { ProductEditDrawerComponent } from '../product-edit-drawer/product-edit-drawer.component';  // 👈 new
import { Product } from '../../../../services/models/product.models';
import { ProductService } from '../../../../services/services/product.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-list-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SwitchComponent,
    ButtonComponent,
    ModalComponent,
    ProductAvancementComponent,
    ProductStockEntryComponent,
    ProductEditDrawerComponent,   // 👈 new
  ],
  templateUrl: './product-list-table.component.html',
  styleUrl: './product-list-table.component.css',
})
export class ProductListTableComponent implements OnInit {

  constructor(
    private router: Router,
    private productService: ProductService,
  ) {}
  tableData: Product[] = [];
  isLoading    = false;
  errorMessage = '';

  selectedProduct: Product | null = null;
  isOpen          = false;
  isStockModalOpen = false;
  isEditDrawerOpen = false;

  apiEndPoint = environment.apiUrl;


  ngOnInit(): void {
    this.refreshTable();
  }

  refreshTable(): void {
    const shopId = localStorage.getItem('selectedShopId');
    if (!shopId) { this.errorMessage = 'No shop selected.'; return; }

    this.isLoading = true;
    this.productService.getByShop(shopId).subscribe({
      next:  (products) => { this.tableData = products; this.isLoading = false; },
      error: (err)      => { this.errorMessage = err?.error?.message ?? 'Failed to load products.'; this.isLoading = false; }
    });
  }

  // Toggle available

  updateProductStatus(id: string, isActivate: boolean): void {
    this.productService.setActive(id, isActivate).subscribe({
      next: (updated) => {
        const idx = this.tableData.findIndex(p => p._id === id);
        if (idx !== -1) this.tableData[idx] = updated;
      }
    });
  }


  openEditDrawer(product: Product): void {
    this.selectedProduct = product;
    this.isEditDrawerOpen = true;
  }

  closeEditDrawer(): void {
    this.isEditDrawerOpen = false;
  }

  /** Called when the drawer emits a saved product — patch the row in-place */
  onProductSaved(updated: Product): void {
    const idx = this.tableData.findIndex(p => p._id === updated._id);
    if (idx !== -1) {
      this.tableData[idx] = updated;
      this.tableData = [...this.tableData]; // trigger change detection
    }
    this.closeEditDrawer();
  }

  // modals

  openModal(product: Product): void      { this.selectedProduct = product; this.isOpen = true; }
  openStockModal(product: Product): void { this.selectedProduct = product; this.isStockModalOpen = true; }
  closeModal(): void      { this.isOpen = false; }
  closeStockModal(): void { this.isStockModalOpen = false; }


  newProduct(): void {
    this.router.navigate(['/admin-shop/view/products/add']);
  }

  getBadgeColor(status: string): 'success' | 'warning' | 'error' {
    if (status === 'Available')    return 'success';
    if (status === 'Comming soon') return 'warning';
    return 'error';
  }
}