/*
export interface Order {
  id: string;
  channel: string;       // e.g. 'Online', 'In-store'
  customer: { name: string; email: string; };
  itemCount: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  date: string;
} */

export type OrderStatus = 'pending' | 'in progress' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed';


export interface Order {
  id: string;
  channel: string;
  customer: {
    name: string;
    email: string;
  };
  itemCount: number;
  total: number;
  paymentStatus: string;
  status: OrderStatus;
  date: string | Date;
}

export interface ShopProduct {
  id: string;
  name: string;
  stock: number;
  devise: string;
  price: number;
}

export interface ClientSuggestion {
  id: string;
  name: string;
  email: string;
}

export interface OrderItem {
  produitId: string;
  quantite: number;
  prix: number;
  name?: string;
  stock?: number;
  devise?: string;
}

export interface CreateOrderPayload {
  clientId: string;
  shopId: string;
  items: OrderItem[];
}