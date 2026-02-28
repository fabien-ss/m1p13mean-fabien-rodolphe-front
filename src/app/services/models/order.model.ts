
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

export type OrderStatus = 'pending' | 'in progress' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed';
