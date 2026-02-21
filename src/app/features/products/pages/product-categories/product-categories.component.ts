import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { TextAreaComponent } from '../../../../shared/components/form/input/text-area.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../../shared/components/form/select/select.component';
import { InputFieldComponent } from '../../../../shared/components/form/input/input-field.component';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
import { ProductCategoriesListComponent } from '../../components/product-categories-list/product-categories-list.component';
import { FormsModule } from '@angular/forms';

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
  parentCategories = [
    { label: "Electronics", value: "electronics" },
    { label: "Accessories", value: "accessories" },
    { label: "Clothing", value: "clothing" },
  ];
  categoryName = "test";
  saveIcon = 'check'; // or an SVG/icon reference your app-button supports

  selectedParentCategory: string = '';
  
  onParentCategoryChange(value: any) {
    this.selectedParentCategory = value;
  }
  
  onSaveCategory() {
    // logic to save new category
    console.log("Category saved!");
  }
}
