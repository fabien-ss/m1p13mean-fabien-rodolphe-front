import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';

interface Category {
  id: number;
  name: string;
  parent?: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-product-categories-list',
  imports: [ButtonComponent, SwitchComponent],
  templateUrl: './product-categories-list.component.html',
  styleUrl: './product-categories-list.component.css',
})
export class ProductCategoriesListComponent {
  categories: Category[] = [
    { id: 1, name: 'Electronics', description: 'Electronic devices', status: 'Active' },
    { id: 2, name: 'Accessories', parent: 'Electronics', description: 'Phone and computer accessories', status: 'Active' },
    { id: 3, name: 'Clothing', description: 'Apparel items', status: 'Inactive' },
  ];

  toggleStatus(category: Category) {
    category.status = category.status === 'Active' ? 'Inactive' : 'Active';
  }

  editCategory(category: Category) {
    console.log('Edit category:', category);
    // You can navigate to edit form or open a modal
  }

  deleteCategory(category: Category) {
    this.categories = this.categories.filter(c => c.id !== category.id);
    console.log('Deleted category:', category);
  }

  addCategory(){}
}
