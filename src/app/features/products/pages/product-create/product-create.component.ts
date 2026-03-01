import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BasicSectionComponent } from '../../components/basic-section/basic-section.component';
import { FormsModule } from '@angular/forms'; 
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';

@Component({
  selector: 'app-ecommerce',
  standalone: true,               // 👈 VERY IMPORTANT
  imports: [
    CommonModule,                 // 👈 Always include this
    RouterModule,
    BasicSectionComponent, // form pour ajouter nouveau produt
    FormsModule,
    ComponentCardComponent,
  ],
  templateUrl: './product-create.component.html',
})
export class ProductCreateComponent {

  onSubmit() {
    console.log('Product submitted');
  }
}
