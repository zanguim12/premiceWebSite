// src/app/core/models/filters.model.ts

export interface ProductFilters {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  inStockOnly: boolean;
  minRating?: number;
  badges?: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'best-seller', label: 'Meilleures ventes' },
  { value: 'rating', label: 'Meilleures notes' }
];
