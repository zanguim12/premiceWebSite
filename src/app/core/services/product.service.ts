// src/app/core/services/product.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, delay } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductFilters} from '../models/filters.model';
import { Category } from '../models/category.model';
import { Brand } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSignal = signal<Product[]>([]);
  private categoriesSignal = signal<Category[]>([]);
  private brandsSignal = signal<Brand[]>([]);
  private loadingSignal = signal<boolean>(false);  

  // Computed values
  products = this.productsSignal.asReadonly();
  categories = this.categoriesSignal.asReadonly();
  brands = this.brandsSignal.asReadonly();
  isLoading = this.loadingSignal.asReadonly();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.loadingSignal.set(true);
    
    // Charger les produits depuis le JSON
    this.http.get<{ products: Product[] }>('/assets/data/products.json')
      .subscribe({
        next: (data) => {
          this.productsSignal.set(data.products);
          this.extractCategoriesAndBrands(data.products);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          console.error('Erreur chargement produits:', error);
          this.loadingSignal.set(false);
        }
      });
  }

  private extractCategoriesAndBrands(products: Product[]): void {
    // Extraire les catégories uniques
    const categoryMap = new Map<string, Category>();
    const brandMap = new Map<string, Brand>();

    products.forEach(product => {
      // Catégories
      if (!categoryMap.has(product.categoryId)) {
        categoryMap.set(product.categoryId, {
          id: product.categoryId,
          name: product.category,
          slug: product.categoryId,
          icon: this.getCategoryIcon(product.categoryId),
          count: 0,
          featured: false
        });
      }
      const category = categoryMap.get(product.categoryId)!;
      category.count++;

      // Marques
      if (!brandMap.has(product.brandId)) {
        brandMap.set(product.brandId, {
          id: product.brandId,
          name: product.brand,
          slug: product.brandId,
          logo: `/assets/images/brands/${product.brandId}.png`,
          featured: false
        });
      }
    });

    this.categoriesSignal.set(Array.from(categoryMap.values()));
    this.brandsSignal.set(Array.from(brandMap.values()));
  }

  private getCategoryIcon(categoryId: string): string {
    const icons: { [key: string]: string } = {
      'laptops': 'laptop',
      'desktops': 'desktop',
      'printers': 'printer',
      'accessories': 'keyboard',
      'software': 'code'
    };
    return icons[categoryId] || 'package';
  }

  // Récupérer tous les produits
  getAllProducts(): Observable<Product[]> {
    return of(this.productsSignal());
  }

  // Récupérer un produit par ID
  getProductById(id: string): Observable<Product | undefined> {
    const product = this.productsSignal().find(p => p.id === id);
    return of(product).pipe(delay(300)); // Simuler latence réseau
  }

  // Récupérer un produit par slug
  getProductBySlug(slug: string): Observable<Product | undefined> {
    const product = this.productsSignal().find(p => p.slug === slug);
    return of(product).pipe(delay(300));
  }

  // Filtrer les produits
  filterProducts(filters: Partial<ProductFilters>): Observable<Product[]> {
    let filtered = [...this.productsSignal()];

    // Filtre par catégories
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(p => 
        filters.categories!.includes(p.categoryId)
      );
    }

    // Filtre par marques
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => 
        filters.brands!.includes(p.brandId)
      );
    }

    // Filtre par prix
    if (filters.priceRange) {
      filtered = filtered.filter(p => 
        p.price >= filters.priceRange!.min && 
        p.price <= filters.priceRange!.max
      );
    }

    // Filtre stock uniquement
    if (filters.inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Filtre par note
    if (filters.minRating) {
      filtered = filtered.filter(p => 
        p.rating.average >= filters.minRating!
      );
    }

    // Filtre par badges
    if (filters.badges && filters.badges.length > 0) {
      filtered = filtered.filter(p => 
        p.badges.some(badge => filters.badges!.includes(badge))
      );
    }

    return of(filtered).pipe(delay(300));
  }

  // Rechercher des produits
  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) {
      return of(this.productsSignal());
    }

    const results = this.productsSignal().filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.description.short.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    return of(results).pipe(delay(300));
  }

  // Trier les produits
  sortProducts(products: Product[], sortBy: string): Product[] {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      
      case 'best-seller':
        return sorted.sort((a, b) => 
          (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0)
        );
      
      case 'rating':
        return sorted.sort((a, b) => b.rating.average - a.rating.average);
      
      default: // relevance
        return sorted;
    }
  }

  // Récupérer les produits en vedette
  getFeaturedProducts(limit: number = 8): Observable<Product[]> {
    const featured = this.productsSignal()
      .filter(p => p.featured)
      .slice(0, limit);
    return of(featured);
  }

  // Récupérer les nouveautés
  getNewArrivals(limit: number = 8): Observable<Product[]> {
    const newProducts = this.productsSignal()
      .filter(p => p.newArrival)
      .slice(0, limit);
    return of(newProducts);
  }

  // Récupérer les best-sellers
  getBestSellers(limit: number = 8): Observable<Product[]> {
    const bestSellers = this.productsSignal()
      .filter(p => p.bestSeller)
      .slice(0, limit);
    return of(bestSellers);
  }

  // Récupérer les produits avec promo
  getPromotions(limit: number = 8): Observable<Product[]> {
    const promos = this.productsSignal()
      .filter(p => p.discount && p.discount > 0)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, limit);
    return of(promos);
  }

  // Récupérer les produits similaires
  getRelatedProducts(productId: string, limit: number = 4): Observable<Product[]> {
    const product = this.productsSignal().find(p => p.id === productId);
    if (!product) return of([]);

    const related = this.productsSignal()
      .filter(p => 
        p.id !== productId && 
        (p.categoryId === product.categoryId || 
         product.relatedProducts.includes(p.id))
      )
      .slice(0, limit);

    return of(related);
  }

  // Récupérer la fourchette de prix
  getPriceRange(): { min: number; max: number } {
    const prices = this.productsSignal().map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }
}