import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { DatePickerComponent } from '../../../../shared/components/form/date-picker/date-picker.component';
import { Order, OrderStatus, ShopProduct, ClientSuggestion, OrderItem } from '../../../../services/models/order.model';
import { OrderService } from '../../../../services/services/order.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-product-orders',
  imports: [TitleCasePipe, ButtonComponent, DatePickerComponent, FormsModule],
  templateUrl: './product-orders.component.html',
  styleUrl: './product-orders.component.css',
})
export class ProductOrdersComponent implements OnInit {

  // ── État général ──────────────────────────────────────────
  orders: Order[] = [];
  filterStatus: 'all' | OrderStatus = 'all';
  startDate = '';
  endDate = '';
  pending = 0;
  processing = 0;
  delivered = 0;
  cancelled = 0;

  // ── Modals ────────────────────────────────────────────────
  isCancelModalOpen = false;
  isCreateModalOpen = false;
  selectedOrder: Order | null = null;
  isValidateModalOpen: boolean = false;

  // ── Création de commande ──────────────────────────────────
  shopProducts: ShopProduct[] = [];
  clientSuggestions: ClientSuggestion[] = [];
  selectedClient: ClientSuggestion | null = null;
  clientSearchQuery = '';
  orderItems: OrderItem[] = [];
  isSubmitting = false;
  createError = '';

  private clientSearch$ = new Subject<string>();

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.refreshOrders();

    // Autocomplete client avec debounce
    this.clientSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => q.length >= 2 ? this.orderService.searchClients(q) : of([]))
    ).subscribe(results => {
      this.clientSuggestions = results;
    });
  }

  setStartDate($event: any) {
    this.startDate = $event.dateStr;
    this.refreshOrders();
  }

  setEndDate($event: any) {
    this.endDate = $event.dateStr;
    this.refreshOrders();
  }

  // ── Chargement ────────────────────────────────────────────
  refreshOrders() {
    const shopId = localStorage.getItem('selectedShopId');
    if (!shopId) return;

    this.orderService.getOrdersByShop(shopId, this.startDate, this.endDate).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.pending = orders.filter(o => o.status === 'pending').length;
        this.processing = orders.filter(o => o.status === 'in progress').length;
        this.delivered = orders.filter(o => o.status === 'delivered').length;
        this.cancelled = orders.filter(o => o.status === 'cancelled').length;
      },
      error: (err) => console.error('Failed to load orders:', err)
    });
  }

  get filteredOrders(): Order[] {
    if (this.filterStatus === 'all') return this.orders;
    return this.orders.filter(o => o.status === this.filterStatus);
  }

  // ── Actions tableau ───────────────────────────────────────
  viewOrder(order: Order) {
    console.log('View', order);
    // TODO: ouvrir un panel de détail
  }

  openCancelModal(order: Order) {
    this.selectedOrder = order;
    this.isCancelModalOpen = true;
  }

  openValidateModal(order: Order) {
    this.selectedOrder = order;
    this.isValidateModalOpen = true;
  }

  closeCancelModal() {
    this.isCancelModalOpen = false;
    this.selectedOrder = null;
  }

  closeValidateModal() {
    this.isValidateModalOpen = false;
    this.selectedOrder = null;
  }
  confirmCancel() {
    if (!this.selectedOrder) return;
    this.orderService.updateOrderStatus(this.selectedOrder.id, 'cancelled').subscribe({
      next: () => {
        this.refreshOrders();
        this.closeCancelModal();
      },
      error: (err) => console.error('Cancel failed:', err)
    });
  }

  confirmValidate() {
    if (!this.selectedOrder) return;
    this.orderService.updateOrderStatus(this.selectedOrder.id, 'in progress').subscribe({
      next: () => {
        this.refreshOrders();
        this.isValidateModalOpen = false;
        this.selectedOrder = null;
      },
      error: (err) => console.error('Validation failed:', err)
    });
  }

  // ── Création commande ─────────────────────────────────────
  openCreateModal() {
    const shopId = localStorage.getItem('selectedShopId');
    if (!shopId) return;

    this.orderService.getShopProducts(shopId).subscribe({
      next: (products) => {
        this.shopProducts = products;
        this.resetCreateForm();
        this.isCreateModalOpen = true;
      }
    });
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
    this.resetCreateForm();
  }

  resetCreateForm() {
    this.selectedClient = null;
    this.clientSearchQuery = '';
    this.clientSuggestions = [];
    this.orderItems = [];
    this.createError = '';
    this.isSubmitting = false;
  }

  onClientSearch(value: string) {
    this.clientSearchQuery = value;
    this.selectedClient = null;
    this.clientSearch$.next(value);
  }

  selectClient(client: ClientSuggestion) {
    this.selectedClient = client;
    this.clientSearchQuery = client.name;
    this.clientSuggestions = [];
  }

  addItem(product: ShopProduct) {
    const existing = this.orderItems.find(i => i.produitId === product.id);
    if (existing) {
      if (existing.quantite < product.stock) existing.quantite++;
    } else {
      this.orderItems.push({
        produitId: product.id,
        name: product.name,
        quantite: 1,
        prix: product.price,
        stock: product.stock,
        devise: product.devise
      });
    }
  }

  removeItem(index: number) {
    this.orderItems.splice(index, 1);
  }

  get orderTotal(): number {
    return this.orderItems.reduce((sum, i) => sum + i.prix * i.quantite, 0);
  }

  submitOrder() {
    this.createError = '';

    if (!this.selectedClient) {
      this.createError = 'Veuillez sélectionner un client.';
      return;
    }
    if (this.orderItems.length === 0) {
      this.createError = 'Veuillez ajouter au moins un produit.';
      return;
    }
    if (this.orderItems.some(i => i.prix <= 0)) {
      this.createError = 'Tous les produits doivent avoir un prix valide.';
      return;
    }

    const shopId = localStorage.getItem('selectedShopId')!;
    this.isSubmitting = true;

    this.orderService.createOrder({
      clientId: this.selectedClient.id,
      // shopId,
      items: this.orderItems.map(i => ({ produitId: i.produitId, quantite: i.quantite, prix: i.prix }))
    }).subscribe({
      next: (order) => {
        this.orders.unshift(order);
        this.refreshOrders();
        this.closeCreateModal();
      },
      error: (err) => {
        this.createError = err.error?.message ?? 'Erreur lors de la création.';
        this.isSubmitting = false;
      }
    });
  }
}