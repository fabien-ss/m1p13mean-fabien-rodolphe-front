import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { TextAreaComponent } from '../../../../shared/components/form/input/text-area.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../../shared/components/form/select/select.component';
import { InputFieldComponent } from '../../../../shared/components/form/input/input-field.component';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
import { ProductCategoriesListComponent } from '../../components/product-categories-list/product-categories-list.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CategoryService } from '../../../../services/services/category.service';
import { Category } from '../../../../services/models/category.model';

@Component({
  selector: 'app-product-categories',
  imports: [
    ButtonComponent, 
    SwitchComponent, 
    TextAreaComponent, 
    LabelComponent,
    SelectComponent,
    InputFieldComponent,
    ComponentCardComponent,
    ProductCategoriesListComponent,
    FormsModule
  ],
  templateUrl: './product-categories.component.html',
  styleUrl: './product-categories.component.css',
})
export class ProductCategoriesComponent {
  @Output() notify = new EventEmitter<void>();

  categoryDescription: any;
  categoryStatus: boolean = false;
  errorMessage: string = "";

  constructor(private http: HttpClient, private categoryService: CategoryService) {}

  optionCategories: any[] = [
  ];
  trueCategories: Category[]  = [];

  private apiEndPoint = environment.apiUrl;
  private apiUrl = `${this.apiEndPoint}/category`;

  getAllCategor(){
    const shopId = localStorage.getItem('selectedShopId');
    this.categoryService.getAllByShop(shopId!).subscribe({
      next: (data) => {
        this.trueCategories = data;
        this.optionCategories = data.map((cat) => ({ value: cat._id!, label: cat.name! }));
      },
      error: (err) => this.errorMessage = err?.error?.message ?? 'Failed to load categories.'
    });
  }

  postNewCategory(category: any) {
    // send req.user 
    this.http.post(this.apiUrl, category).subscribe({
      next: (response) => {
        console.log('Category created:', response);
        this.getAllCategor(); // Refresh the list of categories
        // this.notify.emit();
      },
      error: (error) => {
        console.error('Error creating category:', error);
        this.errorMessage = 'Failed to create category.';
      }
    });
  }

  saveNewCategory() {}

  categoryName = "test";
  saveIcon = 'check'; // or an SVG/icon reference your app-button supports

  selectedParentCategory: string = '';
  
  onParentCategoryChange(value: any) {
    this.selectedParentCategory = value;
  }
  
  onSaveCategory() {
    // check if all required fieds are selectionned
    if (!this.categoryName) {
      this.errorMessage = 'Please enter a category name.';
      return;
    }
    if (!this.categoryDescription) {
      this.errorMessage = 'Please enter a category description.';
      return;
    }
    // add shop id to the category object
    // logic to save new category
    const newCategory = {
      name: this.categoryName,
      description: this.categoryDescription,
      status: this.categoryStatus,
      parent: this.selectedParentCategory,
      shop: localStorage.getItem("selectedShopId")
    };
    this.postNewCategory(newCategory);
    console.log("Category saved!", newCategory);
    this.getAllCategor();
    this.clearForm();
  }
  clearForm() {
    this.categoryName = '';
    this.categoryDescription = '';
    this.categoryStatus = false;
    this.selectedParentCategory = '';
    this.errorMessage = '';
  }
  ngOnInit() {
    this.getAllCategor();
  }
}
