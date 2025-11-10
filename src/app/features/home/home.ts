// src/app/features/home/home.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  featuredProducts = signal<Product[]>([]);
  promotions = signal<Product[]>([]);
  newArrivals = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);
  loading = signal(true);

  // Catégories pour la homepage
  categories = [
    {
      id: 'laptops',
      name: 'Ordinateurs Portables',
      icon: '💻',
      image: 'https://placehold.co/300x200/1A237E/ffffff?text=Laptops',
      description: 'Performance et mobilité'
    },
    {
      id: 'desktops',
      name: 'Ordinateurs Bureau',
      icon: '🖥️',
      image: 'https://placehold.co/300x200/E31E24/ffffff?text=Desktops',
      description: 'Puissance et stabilité'
    },
    {
      id: 'printers',
      name: 'Imprimantes',
      icon: '🖨️',
      image: 'https://placehold.co/300x200/FFC107/212121?text=Printers',
      description: 'Qualité d\'impression'
    },
    {
      id: 'accessories',
      name: 'Accessoires',
      icon: '⌨️',
      image: 'https://placehold.co/300x200/4CAF50/ffffff?text=Accessories',
      description: 'Complétez votre setup'
    }
  ];

  // Slides pour le hero banner
  heroSlides = [
    {
      title: 'Soldes Exceptionnelles',
      subtitle: 'Jusqu\'à -30% sur une sélection d\'ordinateurs',
      cta: 'Découvrir',
      image: 'https://placehold.co/1400x400/E31E24/ffffff?text=Promo+Laptops',
      link: '/products?category=laptops'
    },
    {
      title: 'Nouveautés HP 2025',
      subtitle: 'Les derniers modèles HP Pavilion disponibles',
      cta: 'Voir les nouveautés',
      image: 'https://placehold.co/1400x400/1A237E/ffffff?text=HP+New+2025',
      link: '/products?brand=hp'
    },
    {
      title: 'Imprimantes Canon',
      subtitle: 'Qualité professionnelle à prix imbattable',
      cta: 'Acheter maintenant',
      image: 'https://placehold.co/1400x400/FFC107/212121?text=Canon+Printers',
      link: '/products?category=printers'
    }
  ];

  currentSlide = signal(0);
  autoSlideInterval: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  loadProducts(): void {
    this.loading.set(true);

    // Charger les produits en vedette
    this.productService.getFeaturedProducts(8).subscribe(products => {
      this.featuredProducts.set(products);
    });

    // Charger les promotions
    this.productService.getPromotions(8).subscribe(products => {
      this.promotions.set(products);
    });

    // Charger les nouveautés
    this.productService.getNewArrivals(8).subscribe(products => {
      this.newArrivals.set(products);
    });

    // Charger les best-sellers
    this.productService.getBestSellers(8).subscribe(products => {
      this.bestSellers.set(products);
      this.loading.set(false);
    });
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change toutes les 5 secondes
  }

  nextSlide(): void {
    this.currentSlide.update(current => 
      (current + 1) % this.heroSlides.length
    );
  }

  prevSlide(): void {
    this.currentSlide.update(current => 
      current === 0 ? this.heroSlides.length - 1 : current - 1
    );
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
  }
}
