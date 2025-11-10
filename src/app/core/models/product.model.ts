// src/app/core/models/product.model.ts

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  brandId: string;
  category: string;
  categoryId: string;
  subCategory?: string;
  price: number;
  oldPrice?: number;
  currency: string;
  discount?: number;
  inStock: boolean;
  stockQuantity: number;
  lowStock: boolean;
  images: {
    thumbnail: string;
    main: string;
    gallery: string[];
  };
  description: {
    short: string;
    long: string;
  };
  specifications: ProductSpecifications;
  features: string[];
  included: string[];
  rating: ProductRating;
  badges: string[];
  tags: string[];
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  relatedProducts: string[];
  seo: ProductSEO;
  shipping: ShippingInfo;
  availability: Availability;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecifications {
  processor?: {
    brand: string;
    model: string;
    generation?: string;
    cores?: number;
    speed?: string;
  };
  memory?: {
    size: string;
    type: string;
    expandable: boolean;
    maxMemory?: string;
  };
  storage?: {
    type: string;
    size: string;
    expandable: boolean;
  };
  display?: {
    size: string;
    resolution: string;
    type: string;
    touchscreen: boolean;
  };
  graphics?: {
    type: string;
    model: string;
  };
  battery?: {
    capacity: string;
    life: string;
  };
  connectivity?: {
    wifi: string;
    bluetooth: string;
    usb: string;
    hdmi?: string;
    ethernet?: string;
  };
  os?: string;
  weight?: string;
  dimensions?: string;
  color?: string;
  warranty?: string;
  [key: string]: any; // Pour autres specs flexibles
}

export interface ProductRating {
  average: number;
  count: number;
  distribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface ShippingInfo {
  freeShipping: boolean;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  deliveryTime: string;
}

export interface Availability {
  online: boolean;
  inStore: boolean;
  stores?: string[];
}
