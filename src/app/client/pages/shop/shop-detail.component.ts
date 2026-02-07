import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SHOPS } from '../../data/mock-shops';
import { PRODUCTS } from '../../data/mock-products';
import { CartService } from '../../core/services/cart.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardBadgeComponent } from '@/shared/components/badge';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ZardButtonComponent, ZardBadgeComponent],
  templateUrl: './shop-detail.component.html',
  styles: [`
    .text-serif { font-family: 'Playfair Display', serif; }
    .letter-spacing-widest { letter-spacing: 0.2em; }
  `]
})
export class ShopDetailComponent {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);

  // state pour l'ID venant de l'URL
  shopId = signal<string | null>(this.route.snapshot.paramMap.get('id'));

  // Mock boutique
  shop = computed(() => SHOPS.find(s => s._id === this.shopId()));

  // Ceete partie doit normalement être une requêtes API list des produits d'une boutique
  shopProducts = computed(() => PRODUCTS.filter(p => p.shop === this.shopId()));

  addToCart(product: any) {
    this.cartService.addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
  }
}
