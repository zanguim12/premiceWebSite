// src/app/shared/components/header/header.component.ts

import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  searchQuery = signal('');
  isMobileMenuOpen = signal(false);
  isSearchOpen = signal(false);

  // Catégories pour le menu
  categories = [
    { id: 'laptops', name: 'Ordinateurs Portables', icon: '💻' },
    { id: 'desktops', name: 'Ordinateurs Bureau', icon: '🖥️' },
    { id: 'printers', name: 'Imprimantes', icon: '🖨️' },
    { id: 'accessories', name: 'Accessoires', icon: '⌨️' },
    { id: 'software', name: 'Logiciels', icon: '💿' }
  ];

  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/products'], { 
        queryParams: { search: query } 
      });
      this.isSearchOpen.set(false);
      this.searchQuery.set('');
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  toggleSearch(): void {
    this.isSearchOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/products'], { 
      queryParams: { category: categoryId } 
    });
    this.closeMobileMenu();
  }
}