import { Component, OnInit } from '@angular/core';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { ProductAvancementComponent } from '../product-avancement/product-avancement.component';
import { ProductStockEntryComponent } from '../product-stock-entry/product-stock-entry.component';
import { Product } from '../../../../services/models/product.models';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../services/services/product.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-list-table',
  imports: [
    FormsModule,
    CommonModule,
    SwitchComponent,
    ButtonComponent,
    ModalComponent,
    ProductAvancementComponent,
    ProductStockEntryComponent,
  ],
  templateUrl: './product-list-table.component.html',
  styleUrl: './product-list-table.component.css',
})
export class ProductListTableComponent implements OnInit {
  updateProductStatus(id: string, isActivate: boolean) {
    console.log('Switch toggled for product ID:', id, 'New Status:', isActivate);
    this.productService.setActive(id, isActivate).subscribe({
      next: (updatedProduct) => {
        const index = this.tableData.findIndex(p => p._id === id);
        if (index !== -1) {
          this.tableData[index] = updatedProduct;
        }
      }
    });
  }

  constructor(private router: Router, private productService: ProductService) { }

  isOpen = false;
  isStockModalOpen = false;
  isLoading = false;
  errorMessage = '';
  tableData: Product[] = [];

  selectedProduct: Product | null = null;

  apiEndPoint = environment.apiUrl // Replace with your actual API endpoint

  ngOnInit() {
    this.refreshTable();
  }

  getBadgeColor(status: string): 'success' | 'warning' | 'error' {
    if (status === 'Available') return 'success';
    if (status === 'Comming soon') return 'warning';
    return 'error';
  }

  newProduct() {
    this.router.navigate(['/admin-shop/view/products/add']);
  }

  openModal(product: Product) { 
    this.selectedProduct = product;
    this.isOpen = true;  
  }
  openStockModal(product: Product) { 
    this.selectedProduct = product; 
    this.isStockModalOpen = true; }
  resetModalFields() { }
//  handlePricingSettings() { this.openModal(); }
  handleSotckEntry() { this.openStockModal(this.selectedProduct!); }
  closeModal() { this.isOpen = false; this.resetModalFields(); }
  closeStockModal() { this.isStockModalOpen = false; this.resetModalFields(); }
  handleStockSettings() { this.openStockModal(this.selectedProduct!); }

  refreshTable(){
    console.log('Refreshing product table...');
    const shopId = localStorage.getItem('selectedShopId');
    if (!shopId) {
      this.errorMessage = 'No shop selected.';
      return;
    }

    this.isLoading = true;
    this.productService.getByShop(shopId).subscribe({
      next: (products) => {
        this.tableData = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to load products.';
        this.isLoading = false;
      }
    });
  } 
}