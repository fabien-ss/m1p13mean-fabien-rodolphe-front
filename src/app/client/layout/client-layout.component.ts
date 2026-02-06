import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../core/services/cart.service';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ZardBadgeComponent, ZardButtonComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <!-- Header -->
      <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <!-- Logo -->
          <a routerLink="/" class="text-2xl font-bold text-primary-600 tracking-tight">
            <span class="text-secondary-500">Akoor</span>
          </a>

          <!-- Search Bar (Desktop) -->
          <div class="hidden md:flex flex-1 max-w-md">
            <input z-input class="w-full" placeholder="Rechercher un produit, une boutique..." icon="search"/>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <z-button variant="ghost" iconOnly routerLink="/cart" class="relative">
              <span class="material-icons">shopping_cart</span>
              @if (cartService.count() > 0) {
                <z-badge
                         variant="danger"
                         class="absolute -top-1 -right-1"
                         size="sm">
                  {{ cartService.count() }}
                </z-badge>
              }
            </z-button>
            <z-button variant="primary" size="sm" class="hidden sm:flex">Connexion</z-button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 py-8 mt-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 class="font-bold mb-4 text-lg">Akoor</h3>
              <p class="text-gray-500 text-sm">Votre centre commercial digital préféré, accessible partout.</p>
            </div>
            <div>
              <h3 class="font-bold mb-4 text-sm uppercase tracking-wider">Commerce</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li><a href="#">Boutiques</a></li>
                <li><a href="#">Promotions</a></li>
                <li><a href="#">Nouveautés</a></li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-4 text-sm uppercase tracking-wider">Qui sommes nous ?</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li><a href="#">Yoann</a></li>
                <li><a href="#">Fabien</a></li>
              </ul>
            </div>
          </div>
          <div class="text-center border-t pt-8 text-gray-400 text-xs">
            © 2025 Akoor.
          </div>
        </div>
      </footer>
    </div>
  `
})
export class ClientLayoutComponent {
  cartService = inject(CartService);
}
