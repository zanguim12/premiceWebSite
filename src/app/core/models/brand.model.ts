// src/app/core/models/brand.model.ts

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  website?: string;
  featured: boolean;
} 