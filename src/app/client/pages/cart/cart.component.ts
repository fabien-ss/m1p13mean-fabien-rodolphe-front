import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  apiEndPoint = environment.apiUrl;

  isOrdering = signal(false);
  orderSuccess = signal(false);
  orderError = signal('');

  get isLoggedIn(): boolean {
    return !!this.authService.getUser();
  }

  removeFromCart(itemId: number): void {
    this.cartService.remove(itemId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  placeOrder(): void {
    if (!this.isLoggedIn) return;

    this.isOrdering.set(true);
    this.orderError.set('');
    this.orderSuccess.set(false);

    const obs = this.cartService.makeOrder();
    if (!obs) {
      this.isOrdering.set(false);
      this.orderError.set('Impossible de passer la commande. Veuillez réessayer.');
      return;
    }

    obs.subscribe({
      next: () => {
        this.cartService.clearCart();
        this.isOrdering.set(false);
        this.orderSuccess.set(true);
      },
      error: (err) => {
        this.isOrdering.set(false);
        this.orderError.set(
          err?.error?.message ?? err?.message ?? 'Une erreur est survenue. Veuillez réessayer.'
        );
      }
    });
  }
}