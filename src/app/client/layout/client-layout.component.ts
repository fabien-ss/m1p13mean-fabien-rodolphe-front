import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../core/services/cart.service';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';

@Component({
    selector: 'app-client-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, ZardBadgeComponent, ZardButtonComponent],
    styleUrls: ['./client-layout.component.css'],
    template: `
    <div class="min-h-screen flex flex-col bg-gray-50">

      <header
        class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-shadow duration-300"
        [class.header-scrolled]="isScrolled()">
        <div class="container mx-auto px-4 md:px-6 h-16 flex items-center gap-4">

          <!-- Logo -->
          <a routerLink="/" class="flex-shrink-0 flex items-center gap-2 group">
            <span class="text-xl font-black tracking-tight">
              <span class="text-indigo-600">Akoor</span>
            </span>
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-6 ml-4 text-sm font-semibold text-gray-600">
            <a routerLink="/"        routerLinkActive="text-indigo-600 active"  class="nav-link hover:text-gray-900 transition-colors">Accueil</a>
            <a routerLink="/catalog" routerLinkActive="text-indigo-600 active" class="nav-link hover:text-gray-900 transition-colors">Catalogue</a>
            <a routerLink="/shops"   routerLinkActive="text-indigo-600 active" class="nav-link hover:text-gray-900 transition-colors">Boutiques</a>
            <a routerLink="/deals"   routerLinkActive="text-indigo-600 active" class="nav-link hover:text-gray-900 transition-colors flex items-center gap-1">
              Offres
              <span class="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black">HOT</span>
            </a>
          </nav>

          <!-- Search (Desktop) -->
          <div class="hidden md:flex flex-1 max-w-sm mx-4">
            <div class="search-wrap relative w-full">
              <span class="search-icon material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-colors pointer-events-none">search</span>
              <input
                type="text"
                placeholder="Rechercher produit, boutique..."
                class="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 border border-transparent focus:border-indigo-300 focus:bg-white focus:outline-none text-sm transition-all duration-200"
              />
            </div>
          </div>

          <!-- Spacer on mobile -->
          <div class="flex-1 md:hidden"></div>

          <!-- Actions -->
          <div class="flex items-center gap-1">

            <!-- Mobile search toggle -->
            <button
              (click)="toggleSearch()"
              class="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <span class="material-icons text-base">search</span>
            </button>


                <a routerLink="/cart"
                  class="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                  <span class="material-icons text-base">shopping_bag</span>
                  @if (cartService.count() > 0) {
                    <span class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center px-1">
                      {{ cartService.count() }}
                    </span>
                  }
                </a>
    
                <!-- Auth buttons -->
                <div class="hidden sm:flex items-center gap-2 ml-2">
                  <a routerLink="/auth/login"
                    class="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                    Connexion
                  </a>
                  <a routerLink="/auth/register"
                    class="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm">
                    S'inscrire
                  </a>
                </div>

            <!-- Mobile menu toggle -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors ml-1">
              <span class="material-icons text-base">{{ mobileMenuOpen() ? 'close' : 'menu' }}</span>
            </button>
          </div>
        </div>

        <!-- Mobile search bar -->
        @if (searchOpen()) {
          <div class="md:hidden px-4 pb-3 border-t border-gray-100 pt-3 mobile-menu-enter">
            <div class="relative">
              <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
              <input
                type="text"
                autofocus
                placeholder="Rechercher..."
                class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 border border-transparent focus:border-indigo-300 focus:bg-white focus:outline-none text-sm transition-all"
              />
            </div>
          </div>
        }

        <!-- Mobile nav menu -->
        @if (mobileMenuOpen()) {
          <nav class="md:hidden border-t border-gray-100 bg-white mobile-menu-enter">
            <div class="container mx-auto px-4 py-4 flex flex-col gap-1">
              <a routerLink="/"         (click)="toggleMobileMenu()" class="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">🏠 Accueil</a>
              <a routerLink="/catalog"  (click)="toggleMobileMenu()" class="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">📦 Catalogue</a>
              <a routerLink="/shops"    (click)="toggleMobileMenu()" class="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">🏪 Boutiques</a>
              <a routerLink="/deals"    (click)="toggleMobileMenu()" class="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">⚡ Offres Flash</a>
              <a routerLink="/map"      (click)="toggleMobileMenu()" class="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">🗺️ Plan du centre</a>
              <div class="border-t border-gray-100 mt-2 pt-3 flex gap-2">
                <a routerLink="/auth/login"    class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center border border-gray-200 text-gray-700 hover:border-indigo-300 transition-colors">Connexion</a>
                <a routerLink="/auth/register" class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">S'inscrire</a>
              </div>
            </div>
          </nav>
        }
      </header>

      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-white border-t border-gray-100 mt-8">
        <div class="container mx-auto px-6 md:px-10 py-14">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

            <div class="md:col-span-1 space-y-4">
              <div class="flex items-center gap-2">
                <span class="text-xl font-black text-indigo-600">Akoor</span>
              </div>
              <p class="text-sm text-gray-500 leading-relaxed max-w-xs">
                Votre centre commercial digital — des centaines de boutiques accessibles partout, à tout moment.
              </p>
            </div>

            <div class="space-y-4">
              <h3 class="font-black text-gray-900 text-sm uppercase tracking-wider">Commerce</h3>
              <ul class="space-y-2.5 text-sm text-gray-500">
                <li><a routerLink="/catalog" class="footer-link">Catalogue</a></li>
                <li><a routerLink="/deals"   class="footer-link">Offres Flash</a></li>
                <li><a routerLink="/shops"   class="footer-link">Boutiques</a></li>
              </ul>
            </div>

            <div class="space-y-4">
              <h3 class="font-black text-gray-900 text-sm uppercase tracking-wider">Mon compte</h3>
              <ul class="space-y-2.5 text-sm text-gray-500">
                <li><a routerLink="/account"         class="footer-link">Mon profil</a></li>
                <li><a routerLink="/account/orders"  class="footer-link">Mes commandes</a></li>
              </ul>
            </div>

            <div class="space-y-4">
              <h3 class="font-black text-gray-900 text-sm uppercase tracking-wider">Qui sommes-nous ?</h3>
              <ul>
                <li>
                    <p class="text-sm text-gray-500">RAKOTO-HARISOA Rodolphe Yoann</p>
                </li>
                <li>
                    <p class="text-sm text-gray-500">RAKOTOMANANA Andriniaina Fabien</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="border-t border-gray-100">
          <div class="container mx-auto px-6 md:px-10 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
            <span>© 2025 Akoor · Tous droits réservés</span>
            <div class="flex gap-4">
              <a href="#" class="footer-link">Conditions d'utilisation</a>
              <a href="#" class="footer-link">Politique de confidentialité</a>
              <a href="#" class="footer-link">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class ClientLayoutComponent {
    cartService = inject(CartService);
    isScrolled = signal(false);
    mobileMenuOpen = signal(false);
    searchOpen = signal(false);

    @HostListener('window:scroll')
    onScroll(): void {
        this.isScrolled.set(window.scrollY > 10);
    }

    toggleMobileMenu(): void {
        this.mobileMenuOpen.update(v => !v);
        if (this.searchOpen()) this.searchOpen.set(false);
    }

    toggleSearch(): void {
        this.searchOpen.update(v => !v);
        if (this.mobileMenuOpen()) this.mobileMenuOpen.set(false);
    }
}
