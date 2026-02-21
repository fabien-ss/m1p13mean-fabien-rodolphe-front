import { Component } from '@angular/core';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { ProductAvancementComponent } from '../product-avancement/product-avancement.component';
import { ProductStockEntryComponent } from '../product-stock-entry/product-stock-entry.component';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  variant?: string;
  price: string;
  image: string;
  stock: number;
  locked: number;
  minStock: number;
  status: 'Available' | 'Out of stock' | 'Coming soon';
  lastUpdated: string; // ISO date string
}
@Component({
  selector: 'app-product-list-table',
  imports: [
    SwitchComponent, 
    ButtonComponent,
    ModalComponent,
    ProductAvancementComponent,
    ProductStockEntryComponent,
  ],
  templateUrl: './product-list-table.component.html',
  styleUrl: './product-list-table.component.css',
})
export class ProductListTableComponent {

  constructor(private router: Router) {}

  isOpen = false;

  isStockModalOpen = false;

  tableData: Product[] = [
    {
      id: 1,
      name: "MacBook Pro 13”",
      sku: "MBP-13",
      variant: "2 Variants",
      category: "Laptop",
      price: "$2399.00",
      status: "Available",
      stock: 25,
      locked: 3,
      minStock: 5,
      lastUpdated: "2026-02-22T10:30:00Z",
      image: "/images/product/product-01.jpg",
    },
    {
      id: 2,
      name: "Apple Watch Ultra",
      sku: "AW-Ultra",
      variant: "1 Variant",
      category: "Watch",
      price: "$879.00",
      status: "Out of stock",
      stock: 0,
      locked: 0,
      minStock: 10,
      lastUpdated: "2026-02-20T14:15:00Z",
      image: "/images/product/product-02.jpg",
    },
    {
      id: 3,
      name: "iPhone 15 Pro Max",
      sku: "IP15PM",
      variant: "2 Variants",
      category: "SmartPhone",
      price: "$1869.00",
      status: "Coming soon",
      stock: 0,
      locked: 0,
      minStock: 5,
      lastUpdated: "2026-02-18T09:00:00Z",
      image: "/images/product/product-03.jpg",
    },
    {
      id: 4,
      name: "iPad Pro 3rd Gen",
      sku: "IPAD3",
      variant: "2 Variants",
      category: "Electronics",
      price: "$1699.00",
      status: "Available",
      stock: 12,
      locked: 2,
      minStock: 5,
      lastUpdated: "2026-02-21T12:45:00Z",
      image: "/images/product/product-04.jpg",
    },
    {
      id: 5,
      name: "AirPods Pro 2nd Gen",
      sku: "AP2",
      variant: "1 Variant",
      category: "Accessories",
      price: "$240.00",
      status: "Available",
      stock: 50,
      locked: 5,
      minStock: 10,
      lastUpdated: "2026-02-19T16:30:00Z",
      image: "/images/product/product-05.jpg",
    },
  ];

  getBadgeColor(status: string): 'success' | 'warning' | 'error' {
    if (status === 'Available') return 'success';
    if (status === 'Comming soon') return 'warning';
    return 'error';
  }
  newProduct(){
    this.router.navigate(['/shop/view/products/add']);
  }

  openModal() {
    this.isOpen = true;
  }

  openStockModal() {
    this.isStockModalOpen = true;
  }

  resetModalFields() {
  }

  handlePricingSettings() {
    this.openModal();
  }

  handleSotckEntry() {
    this.openStockModal();
  }

  closeModal() {
    this.isOpen = false;
    this.resetModalFields();
  }

  closeStockModal() {
    this.isStockModalOpen = false;
    this.resetModalFields();
  }

  handleStockSettings() {
    this.openStockModal();
  }
}
