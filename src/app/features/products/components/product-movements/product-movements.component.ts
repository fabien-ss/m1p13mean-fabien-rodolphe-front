import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementService } from '../../../../services/services/movement.service';
import { Movement } from '../../../../services/models/movement.models';

@Component({
  selector: 'app-product-movements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-movements.component.html',
  styleUrl: './product-movements.component.css',
})
export class ProductMovementsComponent implements OnInit {
  filterType: 'all' | 'in' | 'out' = 'all';
  movements: Movement[] = [];
  isLoading = false;
  errorMessage = '';

  totalIn = 0;
  totalOut = 0;

  constructor(private movementService: MovementService) {}

  ngOnInit() {
    this.loadMovements();
  }

  loadMovements() {
    const shopId = localStorage.getItem('selectedShopId');
    if (!shopId) { this.errorMessage = 'No shop selected.'; return; }

    this.isLoading = true;
    this.movementService.getByShop(shopId, this.filterType).subscribe({
      next: (data) => { 
        this.movements = data; 
        this.totalIn = this.movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0);
        this.totalOut = this.movements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0);
        this.isLoading = false; 
      },
      error: (err) => { this.errorMessage = err?.error?.message ?? 'Failed to load.'; this.isLoading = false; }
    });
    console.log('Loaded movements with filter:', this.filterType);
  }

  setFilter(type: 'all' | 'in' | 'out') {
    this.filterType = type;
    this.loadMovements();
  }

  get filteredMovements(): Movement[] {
    return this.movements;
  }
}