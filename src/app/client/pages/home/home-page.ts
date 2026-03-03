import { Component, inject, computed, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ProductService } from '../../core/services/product.service';
import { ShopService } from '../../core/services/shop.service';
import { CartService } from '../../core/services/cart.service';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardCardComponent } from '@/shared/components/card';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ZardButtonComponent, ZardBadgeComponent, ZardCardComponent],
  templateUrl: './home-page.html'
})
export class HomePage {
  private productService = inject(ProductService);
  private shopService = inject(ShopService);
  cartService = inject(CartService);
  apiEndPoint = environment.apiUrl;

  // ressources lancent l'appel HTTP
  productsResource = resource({
    loader: () => firstValueFrom(this.productService.getProductsList())
  });

  shopsResource = resource({
    loader: () => firstValueFrom(this.shopService.getFeaturedShops())
  });

  hotDealsResource = resource({
    loader: () => firstValueFrom(this.productService.getHotDeals())
  });

  allProducts = computed(() => this.productsResource.value() ?? []);
  shops = computed(() => this.shopsResource.value() ?? []);
  hotDeals = computed(() => this.hotDealsResource.value() ?? []);

  promotions = computed(() => 
    this.allProducts().filter(p => p.promo || (p.oldPrice && p.oldPrice > p.price)).slice(0, 4)
  );

  newArrivals = computed(() => 
    this.allProducts().slice(0, 8)
  );

  // États de chargement pour l'UI
  isLoading = computed(() => this.productsResource.isLoading() || this.shopsResource.isLoading());

  addToCart(product: any, event: Event) {
    event.stopPropagation();
    this.cartService.addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
  }

  calcDiscount(oldPrice: number, price: number): number {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }
}