// src/app/core/models/cart.model.ts

import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}