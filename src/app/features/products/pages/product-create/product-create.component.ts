import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BasicSectionComponent } from '../../components/basic-section/basic-section.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { FormsModule } from '@angular/forms'; 
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';

@Component({
  selector: 'app-ecommerce',
  standalone: true,               // 👈 VERY IMPORTANT
  imports: [
    CommonModule,                 // 👈 Always include this
    RouterModule,
    BasicSectionComponent,
    ButtonComponent,
    FormsModule,
    ComponentCardComponent,
    SwitchComponent,
    LabelComponent
  ],
  templateUrl: './product-create.component.html',
})
export class ProductCreateComponent {

  onSubmit() {
    console.log('Product submitted');
  }
}
