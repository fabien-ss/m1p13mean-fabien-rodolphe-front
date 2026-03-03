import { Component, inject, signal, computed, resource } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SHOPS } from '../../data/mock-shops';
import { PRODUCTS } from '../../data/mock-products';
import { CartService } from '../../core/services/cart.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ShopService } from '@/client/core/services/shop.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '@/client/core/services/product.service';
import { environment } from 'src/environments/environment';

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
  private shopService = inject(ShopService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  apiEndPoint = environment.apiUrl;

  private routeId = toSignal(
    this.route.paramMap.pipe(map(pm => pm.get('id') ?? '')),
    { initialValue: '' }
  );

  shopId = computed(() => this.routeId());

  shopResource = resource({
    params: () => { return this.shopId() },
    loader: async ({ params: id }) => {
      if (!id) return null;
      return await firstValueFrom(this.shopService.getShopById(id));
    },
  });

  shop = computed(() => this.shopResource.value()); // Product | null

  shopProductsResource = resource({
    params: () => this.shop() ?? '',
    loader: async ({ params: shop }) => {
      if (!shop) return [];
      return await firstValueFrom(this.productService.getProductsByShop(shop._id));
    },
  });

  isLoading     = computed(() => this.shopProductsResource.isLoading());
  
  shopProducts = computed(() => this.shopProductsResource.value() ?? []);

  addToCart(product: any) {
    this.cartService.addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
  }
}
