import { Address } from './user.model';

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  notes: string;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  created_at: string;
}
