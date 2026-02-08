import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { DatePickerComponent } from '../../../../shared/components/form/date-picker/date-picker.component';
import { FormsModule } from '@angular/forms';

export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed';

export interface Order {
  id: string;
  channel: string;       // e.g. 'Online', 'In-store'
  customer: { name: string; email: string; };
  itemCount: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  date: string;
}

@Component({
  selector: 'app-product-orders',
  imports: [
    TitleCasePipe, 
    ButtonComponent,
    DatePickerComponent,
    FormsModule
  ],
  templateUrl: './product-orders.component.html',
  styleUrl: './product-orders.component.css',
})
export class ProductOrdersComponent {

  isCancelModelOpen = false;

  filterStatus: 'all' | OrderStatus = 'all';

  startDate = "";

  endDate= "";

  orders: Order[] = [
    { id: 'ORD-001', channel: 'Online',    customer: { name: 'Alice Martin',   email: 'alice@email.com'   }, itemCount: 2, total: 6000,  paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-10' },
    { id: 'ORD-002', channel: 'In-store',  customer: { name: 'Bob Smith',      email: 'bob@email.com'     }, itemCount: 1, total: 3000,  paymentStatus: 'pending', status: 'pending',    date: '2026-02-20' },
    { id: 'ORD-003', channel: 'Online',    customer: { name: 'Clara Dunn',     email: 'clara@email.com'   }, itemCount: 3, total: 9000,  paymentStatus: 'paid',    status: 'processing', date: '2026-02-21' },
    { id: 'ORD-004', channel: 'Online',    customer: { name: 'David Osei',     email: 'david@email.com'   }, itemCount: 1, total: 3000,  paymentStatus: 'failed',  status: 'cancelled',  date: '2026-02-19' },
    { id: 'ORD-005', channel: 'Online',    customer: { name: 'Emma Wilson',    email: 'emma@email.com'    }, itemCount: 4, total: 12000, paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-08' },
    { id: 'ORD-006', channel: 'In-store',  customer: { name: 'Frank Leblanc',  email: 'frank@email.com'   }, itemCount: 2, total: 5500,  paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-07' },
    { id: 'ORD-007', channel: 'Online',    customer: { name: 'Grace Kim',      email: 'grace@email.com'   }, itemCount: 1, total: 2999,  paymentStatus: 'pending', status: 'pending',    date: '2026-02-21' },
    { id: 'ORD-008', channel: 'Online',    customer: { name: 'Henry Dubois',   email: 'henry@email.com'   }, itemCount: 2, total: 7500,  paymentStatus: 'paid',    status: 'processing', date: '2026-02-20' },
    { id: 'ORD-009', channel: 'In-store',  customer: { name: 'Isabelle Roy',   email: 'isa@email.com'     }, itemCount: 3, total: 8200,  paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-15' },
    { id: 'ORD-010', channel: 'Online',    customer: { name: 'James Carter',   email: 'james@email.com'   }, itemCount: 1, total: 3000,  paymentStatus: 'failed',  status: 'cancelled',  date: '2026-02-14' },
    { id: 'ORD-011', channel: 'Online',    customer: { name: 'Karen Nguyen',   email: 'karen@email.com'   }, itemCount: 5, total: 15000, paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-13' },
    { id: 'ORD-012', channel: 'In-store',  customer: { name: 'Luca Ferrari',   email: 'luca@email.com'    }, itemCount: 2, total: 6400,  paymentStatus: 'pending', status: 'pending',    date: '2026-02-22' },
    { id: 'ORD-013', channel: 'Online',    customer: { name: 'Mia Thompson',   email: 'mia@email.com'     }, itemCount: 1, total: 3000,  paymentStatus: 'paid',    status: 'processing', date: '2026-02-21' },
    { id: 'ORD-014', channel: 'Online',    customer: { name: 'Nathan Brooks',  email: 'nathan@email.com'  }, itemCount: 3, total: 9500,  paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-11' },
    { id: 'ORD-015', channel: 'In-store',  customer: { name: 'Olivia Scott',   email: 'olivia@email.com'  }, itemCount: 2, total: 4800,  paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-09' },
    { id: 'ORD-016', channel: 'Online',    customer: { name: 'Paul Moreau',    email: 'paul@email.com'    }, itemCount: 1, total: 3000,  paymentStatus: 'failed',  status: 'cancelled',  date: '2026-02-18' },
    { id: 'ORD-017', channel: 'Online',    customer: { name: 'Quinn Adams',    email: 'quinn@email.com'   }, itemCount: 4, total: 11200, paymentStatus: 'paid',    status: 'processing', date: '2026-02-20' },
    { id: 'ORD-018', channel: 'In-store',  customer: { name: 'Rachel Green',   email: 'rachel@email.com'  }, itemCount: 2, total: 5900,  paymentStatus: 'pending', status: 'pending',    date: '2026-02-22' },
    { id: 'ORD-019', channel: 'Online',    customer: { name: 'Samuel Petit',   email: 'samuel@email.com'  }, itemCount: 3, total: 8700,  paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-06' },
    { id: 'ORD-020', channel: 'Online',    customer: { name: 'Tina Hoffman',   email: 'tina@email.com'    }, itemCount: 1, total: 3000,  paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-05' },
    { id: 'ORD-021', channel: 'In-store',  customer: { name: 'Umar Hassan',    email: 'umar@email.com'    }, itemCount: 2, total: 6100,  paymentStatus: 'paid',    status: 'processing', date: '2026-02-21' },
    { id: 'ORD-022', channel: 'Online',    customer: { name: 'Valerie Blanc',  email: 'val@email.com'     }, itemCount: 5, total: 13500, paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-04' },
    { id: 'ORD-023', channel: 'Online',    customer: { name: 'William Tang',   email: 'william@email.com' }, itemCount: 1, total: 3000,  paymentStatus: 'pending', status: 'pending',    date: '2026-02-22' },
    { id: 'ORD-024', channel: 'In-store',  customer: { name: 'Xena Patel',     email: 'xena@email.com'    }, itemCount: 3, total: 7800,  paymentStatus: 'paid',    status: 'delivered',  date: '2026-02-03' },
    { id: 'ORD-025', channel: 'Online',    customer: { name: 'Yannick Diallo', email: 'yannick@email.com' }, itemCount: 2, total: 5200,  paymentStatus: 'failed',  status: 'cancelled',  date: '2026-02-17' },
  ];

  get filteredOrders(): Order[] {
    if (this.filterStatus === 'all') return this.orders;
    return this.orders.filter(o => o.status === this.filterStatus);
  }

  newOrder() { }
  viewOrder(order: Order) { console.log('View', order); }
  updateStatus(order: Order) 
  { 
    this.isCancelModelOpen = true
  }
}
