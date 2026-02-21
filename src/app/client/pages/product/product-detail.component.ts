import { CommonModule, CurrencyPipe, NgIf } from '@angular/common';
import { Component, computed, effect, inject, resource, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { PRODUCTS } from '@/client/data/mock-products';
import { CartService } from '@/client/core/services/cart.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ProductService } from '@/client/core/services/product.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ZardBadgeComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cartService = inject(CartService);

  private routeId = toSignal(
    this.route.paramMap.pipe(map(pm => pm.get('id') ?? '')),
    { initialValue: '' }
  );

  productId = computed(() => this.routeId());

  // state
  qty = signal<number>(1);
  activeImageIndex = signal<number>(0);

  productResource = resource({
    params: () => {return this.productId()}, // ✅ rerun when route id changes
    loader: async ({ params: id }) => {
      if (!id) return null;
      return await firstValueFrom(this.productService.getProductById(id));
    },
  });

  product = computed(() => this.productResource.value()); // Product | null

  relatedProductsResource = resource({
    params: () => this.product()?.shop ?? '', // ✅ rerun when product/shop changes
    loader: async ({ params: shopId }) => {
      if (!shopId) return [];
      return await firstValueFrom(this.productService.getProductsByShop(shopId._id));
    },
  });

  related = computed(() =>
    (this.relatedProductsResource.value() ?? []).filter(p => p._id !== this.productId()).slice(0, 4)
  );

  // derived
  activeImage = computed(() => {
    const p = this.product();
    if (!p?.images?.length) return 'https://placehold.co/800x800?text=No+Image';
    return p.images[this.activeImageIndex()] ?? p.images[0];
  });

  isPromo = computed(() => {
    const p = this.product();
    return !!p?.promo && !!p?.oldPrice && p.oldPrice > p.price;
  });

  discountPercent = computed(() => {
    const p = this.product();
    if (!p?.oldPrice || p.oldPrice <= p.price) return 0;
    return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  });

  stockLabel = computed(() => {
    const p = this.product();
    if (!p) return '';
    if (!p.available) return 'Indisponible';
    if (p.stock <= 0) return 'Rupture de stock';
    if (p.stock <= 5) return `Stock faible (${p.stock})`;
    return `En stock (${p.stock})`;
  });

  constructor() {
    effect(() => {
      this.qty.set(1);
      this.activeImageIndex.set(0);
    });
  }

  incQty() {
    const p = this.product();
    if (!p) return;
    const next = this.qty() + 1;
    // if stock exists, cap to stock
    this.qty.set(p.stock > 0 ? Math.min(next, p.stock) : next);
  }

  decQty() {
    this.qty.set(Math.max(1, this.qty() - 1));
  }

  setImage(i: number) {
    this.activeImageIndex.set(i);
  }


  addToCart() {
    const p = this.product();
    if (!p) return;
    if (!p.available || p.stock <= 0) return;
    this.cartService.addToCart({
      id: p._id,
      name: p.name,
      price: p.price,
      image: p.images[0]
    },this.qty());
  }
}