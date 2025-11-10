// src/app/core/models/order.model.ts

import { CartItem } from './cart.model';

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: CartItem[];
  shipping: ShippingDetails;
  payment: PaymentDetails;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingDetails {
  address: string;
  city: string;
  district: string;
  instructions?: string;
  method: 'home-delivery' | 'pickup-yaounde' | 'pickup-douala';
}

export interface PaymentDetails {
  method: 'mobile-money' | 'bank-card' | 'cash-on-delivery';
  status: 'pending' | 'completed' | 'failed';
  provider?: string; // MTN, Orange, etc.
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';
