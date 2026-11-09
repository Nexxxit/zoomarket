import { encodeCatalogSlugSegment } from '@/shared/lib/catalog-slug';

export const ROUTES = {
  home: '/',
  catalog: '/catalog',
  cart: '/cart',
  favorites: '/favorites',
  delivery: '/delivery',
  promotions: '/promotions',
} as const;

export interface ProductHrefInput {
  id: string;
  animal: string;
  subcategoryId?: string;
  subSection?: string;
}

export function productHref(product: ProductHrefInput): string {
  // TODO(API): товары без subcategoryId не имеют маршрута детали
  // (generateStaticParams их не регистрирует) — ведём на страницу животного.
  if (!product.subcategoryId) {
    return `${ROUTES.catalog}/${encodeCatalogSlugSegment(product.animal)}`;
  }
  return `/catalog/${product.animal}/${product.subcategoryId}/${encodeCatalogSlugSegment(product.subSection || 'all')}/${product.id}`;
}
