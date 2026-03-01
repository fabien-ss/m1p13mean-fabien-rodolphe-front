import { Component, Input, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';

import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../services/services/category.service';
import { Category } from '../../../../services/models/category.model';

@Component({
  selector: 'app-product-categories-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SwitchComponent],
  templateUrl: './product-categories-list.component.html',
  styleUrl: './product-categories-list.component.css',
})
export class ProductCategoriesListComponent {

  @Input() categories: Category[] = [];
  errorMessage = '';

  constructor(private categoryService: CategoryService) {}


  toggleIsActive(category: Category) {
    if (!category._id) return;
    const newState = !category.isActive;
    this.categoryService.setActive(category._id, newState).subscribe({
      next: () => category.isActive = newState,
      error: (err) => this.errorMessage = err?.error?.message ?? 'Failed to update.'
    });
  }

  deleteCategory(category: Category) {
    if (!category._id) return;
    this.categoryService.delete(category._id).subscribe({
      next: () => this.categories = this.categories.filter(c => c._id !== category._id),
      error: (err) => this.errorMessage = err?.error?.message ?? 'Failed to delete.'
    });
  }

  editCategory(category: Category) {
    console.log('Edit category:', category);
  }

  addCategory() {}
}