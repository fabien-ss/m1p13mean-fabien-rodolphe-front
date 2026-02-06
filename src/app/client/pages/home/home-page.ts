import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SHOPS } from '../../data/mock-shops';
import { PRODUCTS } from '../../data/mock-products';
import { CATEGORIES } from '../../data/mock-categories';
import { CartService } from '../../core/services/cart.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardCardComponent } from '@/shared/components/card';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ZardButtonComponent, ZardBadgeComponent, ZardCardComponent],
  templateUrl: './home-page.html'
})
export class HomePage {
  cartService = inject(CartService);

  categories = signal(CATEGORIES);
  shops = signal(SHOPS);

  // Filtrage des promotions
  promotions = signal(PRODUCTS.filter(p => p.promo).slice(0, 4));
  newArrivals = signal(PRODUCTS.slice(0, 8));

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
