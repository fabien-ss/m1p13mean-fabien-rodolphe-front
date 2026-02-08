import { Component } from '@angular/core';
import { RecentOrdersComponent } from '../../../../shared/components/ecommerce/recent-orders/recent-orders.component';
import { ShopMetricsComponent } from '../../components/shop-metrics/shop-metrics.component';
import { MonthlyTargetComponent } from '../../../../shared/components/ecommerce/monthly-target/monthly-target.component';
import { ShopTargetComponent } from '../../components/shop-target/shop-target.component';

@Component({
  selector: 'app-shop-view',
  imports: [
    RecentOrdersComponent, 
    ShopMetricsComponent, 
    ShopTargetComponent,
  ],
  templateUrl: './shop-view.component.html',
  styleUrl: './shop-view.component.css',
})
export class ShopViewComponent {

}
