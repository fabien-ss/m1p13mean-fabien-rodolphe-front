import { Component, inject, computed, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '@/client/core/services/product.service';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';

type Shop = {
  _id: string;
  name: string;
  location?: string;
  images?: string[];
  // optionnels si ton back les renvoie
  type?: string;
  rating?: number;
};

@Component({
  selector: 'app-hot-deal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hot-deal.component.html',
})
export class HotDealComponent {
  private productService = inject(ProductService);
  apiEndPoint = environment.apiUrl;

  hotDealResource = resource({
    loader: () => firstValueFrom(this.productService.getHotDeals()),
  });

  allDeals = computed(() => this.hotDealResource.value() ?? []);
  isLoading = computed(() => this.hotDealResource.isLoading());

  // Juste pour garder un nom explicite dans le HTML
  displayDeals = computed(() => this.allDeals());
}