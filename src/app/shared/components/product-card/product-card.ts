// src/app/shared/components/product-card/product-card.component.ts

import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() compact: boolean = false;

  isAddingToCart = signal(false);
  showAddedToast = signal(false);

  constructor(private cartService: CartService) {}

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.product.inStock) return;

    this.isAddingToCart.set(true);
    
    // Simuler un délai pour l'animation
    setTimeout(() => {
      this.cartService.addToCart(this.product, 1);
      this.isAddingToCart.set(false);
      this.showAddedToast.set(true);

      // Cacher le toast après 2 secondes
      setTimeout(() => {
        this.showAddedToast.set(false);
      }, 2000);
    }, 500);
  }

  getBadgeClass(badge: string): string {
    const classes: { [key: string]: string } = {
      'promo': 'badge-promo',
      'new': 'badge-new',
      'popular': 'badge-popular',
      'bestseller': 'badge-popular'
    };
    return `badge ${classes[badge] || 'badge-promo'}`;
  }

  getStockStatus(): { text: string; class: string } {
    if (!this.product.inStock) {
      return { text: 'Rupture de stock', class: 'text-red-600' };
    }
    if (this.product.lowStock) {
      return { text: `Plus que ${this.product.stockQuantity} en stock`, class: 'text-orange-600' };
    }
    return { text: 'En stock', class: 'text-green-600' };
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price);
  }
}