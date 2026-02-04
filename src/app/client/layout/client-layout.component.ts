import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <!-- Header -->
      <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <a routerLink="/" class="text-2xl font-bold text-primary-600 tracking-tight">
            <span class="text-secondary-500">Akoor</span>
          </a>

          <div class="hidden md:flex flex-1 max-w-md">
            <input z-input class="w-full" placeholder="Rechercher un produit, une boutique..." icon="search"/>
          </div>

        </div>
      </header>

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
            © 2026 Akoor.
          </div>
        </div>
      </footer>
    </div>
  `
})
export class ClientLayoutComponent {
  
}
