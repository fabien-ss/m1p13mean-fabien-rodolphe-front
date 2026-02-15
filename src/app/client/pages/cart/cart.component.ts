import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartService = inject(CartService);

  removeFromCart(itemId: number) {
    this.cartService.remove(itemId);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
