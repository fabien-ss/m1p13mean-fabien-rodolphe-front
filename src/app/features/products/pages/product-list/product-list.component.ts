import { Component } from '@angular/core';
import { ProductListTableComponent } from '../../components/product-list-table/product-list-table.component';
import { ProductMovementsComponent } from '../../components/product-movements/product-movements.component';

@Component({
  selector: 'app-product-list',
  imports: [
    ProductListTableComponent,
    ProductMovementsComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {

}
