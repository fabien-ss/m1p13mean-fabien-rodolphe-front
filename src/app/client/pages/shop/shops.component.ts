import { Component, inject, computed, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ShopService } from '@/client/core/services/shop.service';
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
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shops.component.html',
})
export class ShopsComponent {
  private shopService = inject(ShopService);
  apiEndPoint = environment.apiUrl;
  shopResource = resource({
    loader: () => firstValueFrom(this.shopService.getShops()),
  });

  allShops = computed(() => this.shopResource.value() ?? []);
  isLoading = computed(() => this.shopResource.isLoading());

  // Juste pour garder un nom explicite dans le HTML
  displayShops = computed(() => this.allShops());
}