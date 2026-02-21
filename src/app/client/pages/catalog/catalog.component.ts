import { Component, inject, signal, computed, resource } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '@/client/core/services/product.service';
import { CartService } from '@/client/core/services/cart.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule, 
  ],
  templateUrl: './catalog.component.html',
  styles: [`
    .font-serif { font-family: 'Playfair Display', serif; }
    .letter-spacing-widest { letter-spacing: 0.15em; }
  `]
})
export class CatalogComponent {
  private productService = inject(ProductService);
  cartService = inject(CartService);


  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(12);


  productsResource = resource({
    loader: () => firstValueFrom(this.productService.getProducts())
  });

  allProducts = computed(() => this.productsResource.value() ?? []);
  isLoading = computed(() => this.productsResource.isLoading());

  filteredProducts = computed(() => {
    const search = this.searchTerm().toLowerCase();
    return this.allProducts().filter(p => 
      p.name.toLowerCase().includes(search) || 
      p.brand?.toLowerCase().includes(search)
    );
  });

  addToCart(product: any, event: Event) {
    event.stopPropagation();
    this.cartService.addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
  }
}