// src/app/core/services/cart.service.ts

import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'premice_cart';
  private readonly SHIPPING_FEE = 5000; // 5000 FCFA par défaut

  // Signals
  private itemsSignal = signal<CartItem[]>([]);

  // Computed values
  items = this.itemsSignal.asReadonly();
  
  itemCount = computed(() => 
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  subtotal = computed(() => 
    this.itemsSignal().reduce((sum, item) => sum + item.subtotal, 0)
  );

  shippingFee = computed(() => 
    this.subtotal() >= 500000 ? 0 : this.SHIPPING_FEE
  );

  total = computed(() => 
    this.subtotal() + this.shippingFee()
  );

  isEmpty = computed(() => this.itemsSignal().length === 0);

  cart = computed<Cart>(() => ({
    items: this.itemsSignal(),
    itemCount: this.itemCount(),
    subtotal: this.subtotal(),
    shippingFee: this.shippingFee(),
    discount: 0,
    total: this.total()
  }));

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCartFromStorage();
    
    // Sauvegarder automatiquement à chaque changement
    effect(() => {
      this.saveCartToStorage(this.itemsSignal());
    });
  }

  // Ajouter un produit au panier
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = [...this.itemsSignal()];
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      // Produit déjà dans le panier, augmenter la quantité
      const existingItem = currentItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      // Vérifier le stock
      if (newQuantity <= product.stockQuantity) {
        currentItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          subtotal: product.price * newQuantity
        };
      } else {
        console.warn('Stock insuffisant');
        return;
      }
    } else {
      // Nouveau produit
      if (quantity <= product.stockQuantity) {
        currentItems.push({
          product,
          quantity,
          subtotal: product.price * quantity
        });
      } else {
        console.warn('Stock insuffisant');
        return;
      }
    }

    this.itemsSignal.set(currentItems);
  }

  // Retirer un produit du panier
  removeFromCart(productId: string): void {
    const currentItems = this.itemsSignal().filter(
      item => item.product.id !== productId
    );
    this.itemsSignal.set(currentItems);
  }

  // Mettre à jour la quantité d'un produit
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = [...this.itemsSignal()];
    const itemIndex = currentItems.findIndex(
      item => item.product.id === productId
    );

    if (itemIndex > -1) {
      const item = currentItems[itemIndex];
      
      // Vérifier le stock
      if (quantity <= item.product.stockQuantity) {
        currentItems[itemIndex] = {
          ...item,
          quantity,
          subtotal: item.product.price * quantity
        };
        this.itemsSignal.set(currentItems);
      } else {
        console.warn('Stock insuffisant');
      }
    }
  }

  // Vider le panier
  clearCart(): void {
    this.itemsSignal.set([]);
  }

  // Vérifier si un produit est dans le panier
  isInCart(productId: string): boolean {
    return this.itemsSignal().some(item => item.product.id === productId);
  }

  // Obtenir la quantité d'un produit dans le panier
  getProductQuantity(productId: string): number {
    const item = this.itemsSignal().find(item => item.product.id === productId);
    return item?.quantity || 0;
  }

  // Persistence dans localStorage
  private saveCartToStorage(items: CartItem[]): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const cartData = items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartData));
      } catch (error) {
        console.error('Erreur sauvegarde panier:', error);
      }
    } else {
      // ⚠️ Côté serveur, ne rien faire
      //console.warn('Tentative de sauvegarde du panier côté serveur ignorée.');
    }
  }

  // ✅ Chargement sécurisé depuis le navigateur uniquement
  private loadCartFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const cartData = JSON.parse(stored);
          console.log('Panier chargé:', cartData);
          // Tu peux ici restaurer les produits depuis un ProductService
        }
      } catch (error) {
        console.error('Erreur chargement panier:', error);
      }
    }
  }
}