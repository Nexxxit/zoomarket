export type CatalogSection = 'cat' | 'dog' | 'bird' | 'rodent' | 'fish' | 'vet' | 'brands';

export type CatalogSortType = 'popular' | 'cheap-first' | 'expensive-first';

export interface FilterCriteria {
  searchQuery: string;
  priceMin: string;
  priceMax: string;
  brands: string[];
  onSaleOnly: boolean;
  badgeOnly: boolean;
  sortType: CatalogSortType;
}

export interface CatalogSlugState {
  section: CatalogSection | null;
  animal: string;
  isBrands: boolean;
  isVet: boolean;
  activeBrandName: string | null;
  subcategoryId: string | null;
  subSection: string;
  productId: string | null;
  slugLength: number;
}

export interface BrandFacet {
  name: string;
  count: number;
}
