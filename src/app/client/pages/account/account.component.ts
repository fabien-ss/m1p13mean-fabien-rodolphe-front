import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '@/services/services/order.service';
import { OrderClientInterface } from '@/services/models/order.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  private authService  = inject(AuthService);
  private orderService = inject(OrderService);
  private router       = inject(Router);

  user: any = null;
  orders: OrderClientInterface[] = [];
  ordersLoading = false;
  ordersError   = false;

  get initials(): string {
    if (!this.user) return '?';
    const f = this.user.firstName?.[0] ?? '';
    const l = this.user.name?.[0]     ?? '';
    return (f + l).toUpperCase() || '?';
  }

  get fullName(): string {
    return [this.user?.firstName, this.user?.name].filter(Boolean).join(' ');
  }

  get roleBadge(): { label: string; classes: string } {
    switch (this.user?.role) {
      case 'admin':    return { label: 'Administrateur', classes: 'bg-red-50 border-red-200 text-red-600' };
      case 'boutique': return { label: 'Boutique',       classes: 'bg-indigo-50 border-indigo-200 text-indigo-600' };
      default:         return { label: 'Client',         classes: 'bg-green-50 border-green-200 text-green-600' };
    }
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loadOrders();
    console.log('User orders:', this.orders);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private loadOrders(): void {
    const id = this.user.id ?? this.user._id;
    if (!id) return;

    this.ordersLoading = true;
    this.ordersError   = false;

    this.orderService.getOrdersByClient(id).subscribe({
      next: (orders) => {
        this.orders        = orders;
        this.ordersLoading = false;
      },
      error: () => {
        this.ordersError   = true;
        this.ordersLoading = false;
      },
    });
  }

  statusBadge(status: string): { label: string; classes: string } {
    switch (status) {
      case 'pending':    return { label: 'En attente',  classes: 'bg-yellow-50 border-yellow-200 text-yellow-600' };
      case 'in progress':  return { label: 'Expédiée',   classes: 'bg-blue-50 border-blue-200 text-blue-600' };
      case 'cancelled':  return { label: 'Annulée',     classes: 'bg-red-50 border-red-200 text-red-600' };
      default:           return { label: status,        classes: 'bg-gray-50 border-gray-200 text-gray-600' };
    }
  }
}