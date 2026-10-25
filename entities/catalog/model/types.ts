export interface SubCategory {
  id: string;
  name: string;
  icon: string;
  type: 'food' | 'toy' | 'medicine' | 'accessory';
  itemCount: number;
  subSections: string[];
  imageUrl?: string;
  badge?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  bannerGradient: string;
  subcategoriesCount: number;
  featuredSubcategoryId?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  type: 'food' | 'toy' | 'medicine' | 'accessory';
  subSections: string[];
}

export interface PetCategoryGroup {
  name: string;
  icon: string;
  subcategories: Subcategory[];
}
