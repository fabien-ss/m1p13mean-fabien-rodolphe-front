import { Component } from '@angular/core';
import { ShopSelectionComponent } from '../../components/shop-selection/shop-selection.component';
import { ShopChartComponent } from '../../components/shop-statics/shop-chart.component';

@Component({
  selector: 'app-shop-management',
  imports: [
    ShopSelectionComponent, 
    ShopChartComponent
  ],
  templateUrl: './shop-management.component.html',
  styleUrl: './shop-management.component.css',
})
export class ShopManagementComponent {

}
