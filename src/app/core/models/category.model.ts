// src/app/core/models/category.model.ts

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image?: string;
  count: number;
  description?: string;
  featured: boolean;
  parentId?: string;
  subCategories?: Category[];
}
