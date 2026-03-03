import { Component, inject, signal, computed, resource } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '@/client/core/services/product.service';
import { CartService } from '@/client/core/services/cart.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { CategoryService } from '@/client/core/services/category.service';
import { environment } from 'src/environments/environment';


interface FilterMetadata {
  brands:        { brand: string; count: number }[];
  tags:          { tag:   string; count: number }[];
  priceRange:    { min: number; max: number; avg: number };
  totalProducts: number;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DecimalPipe, ZardButtonComponent],
  templateUrl: './catalog.component.html',
  styles: [`
    .font-serif { font-family: 'Playfair Display', serif; }
  `]
})
export class CatalogComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  cartService = inject(CartService);
  apiEndPoint = environment.apiUrl;

  // Filter useState
  searchTerm       = signal('');
  selectedCategory = signal<string | null>(null);
  selectedBrands   = signal<string[]>([]);
  selectedTags     = signal<string[]>([]);
  inStockOnly      = signal(false);
  onPromoOnly      = signal(false);
  minPrice         = signal<number | null>(null);
  maxPrice         = signal<number | null>(null);
  sortBy           = signal<string>('createdAt_desc');
  currentPage      = signal(1);
  pageSize         = signal(12);

  // Filter metadata resource (brands, tags, price range)
  // Loads once on init — feeds the sidebar
  metadataResource = resource({
    loader: () => firstValueFrom(
      this.productService.getFilterMetadata()
    ) as Promise<FilterMetadata>
  });

  // Get all categories for filter
  categoriesResource = resource({
    loader: () => firstValueFrom(
      this.categoryService.getAll()
    )
  });

  availableBrands = computed(() => this.metadataResource.value()?.brands    ?? []);
  availableTags   = computed(() => this.metadataResource.value()?.tags       ?? []);
  priceRange      = computed(() => this.metadataResource.value()?.priceRange ?? { min: 0, max: 0, avg: 0 });
  availableCategories = computed(() => this.categoriesResource.value() ?? []);

  // Products resource — reloads whenever any filter signal changes
  productsResource = resource({
    params: () => ({
      q:         this.searchTerm(),
      brands:    this.selectedBrands(),
      tags:      this.selectedTags(),
      inStock:   this.inStockOnly()  || undefined,
      onPromo:   this.onPromoOnly()  || undefined,
      minPrice:  this.minPrice()     ?? undefined,
      maxPrice:  this.maxPrice()     ?? undefined,
      category:   this.selectedCategory() ?? undefined,
      sortBy:    this.sortBy().split('_')[0],
      sortOrder: this.sortBy().split('_')[1] ?? 'desc',
      page:      this.currentPage(),
      limit:     this.pageSize(),
    }),
    loader: ({ params }) => firstValueFrom(
      this.productService.searchProducts(params)
    )
  });

  allProducts   = computed(() => this.productsResource.value()?.data       ?? []);
  totalProducts = computed(() => this.productsResource.value()?.total      ?? 0);
  totalPages    = computed(() => this.productsResource.value()?.totalPages  ?? 1);
  isLoading     = computed(() => this.productsResource.isLoading());

  hasActiveFilters = computed(() =>
    !!this.searchTerm()             ||
    this.selectedBrands().length > 0 ||
    this.selectedTags().length   > 0 ||
    this.inStockOnly()               ||
    this.onPromoOnly()               ||
    this.minPrice() !== null         ||
    this.maxPrice() !== null         ||
    !!this.selectedCategory()
  );

  // Smart page numbers with ellipsis
  pageNumbers = computed((): (number | '...')[] => {
    const total = this.totalPages();
    const cur   = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (cur > 3)           pages.push('...');
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
    if (cur < total - 2)   pages.push('...');
    pages.push(total);
    return pages;
  });


  selectCategory(id: string | null): void {
    this.selectedCategory.set(id);
    this.resetPage();
  }

  toggleBrand(brand: string): void {
    this.selectedBrands.update(list =>
      list.includes(brand) ? list.filter(b => b !== brand) : [...list, brand]
    );
    this.resetPage();
  }

  toggleTag(tag: string): void {
    this.selectedTags.update(list =>
      list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]
    );
    this.resetPage();
  }

  applyPrice(): void   { this.resetPage(); }
  applySearch(): void  { this.resetPage(); }

  goToPage(p: number | '...'): void {
    if (p === '...') return;
    this.currentPage.set(p as number);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  prevPage(): void { if (this.currentPage() > 1)               this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set(null);
    this.selectedBrands.set([]);
    this.selectedTags.set([]);
    this.inStockOnly.set(false);
    this.onPromoOnly.set(false);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.sortBy.set('createdAt_desc');
    this.resetPage();
  }

  addToCart(product: any, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart({
      id:    product._id,
      name:  product.name,
      price: product.price,
      image: product.images[0],
    });
  }

  calcDiscount(oldPrice: number, price: number): number {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  resetPage(): void { this.currentPage.set(1); }
}