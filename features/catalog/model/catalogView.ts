import type { CatalogSlugState } from './types';

export type CatalogView = 'home' | 'animal' | 'list' | 'detail';

export interface CatalogViewInput {
  state: CatalogSlugState;
  isSearchActive: boolean;
  hasActiveProduct: boolean;
}

/**
 * Единственный источник истины о том, какой вид каталога показать.
 * Detail только при slug === 4 и найденном товаре; не найденный товар —
 * не «list», а 404 (guard в page.tsx/CatalogPage вызывает notFound()).
 */
export function resolveCatalogView({
  state,
  isSearchActive,
  hasActiveProduct,
}: CatalogViewInput): CatalogView {
  if (state.slugLength === 4 && state.productId && hasActiveProduct) {
    return 'detail';
  }
  if (state.slugLength >= 2 || isSearchActive) {
    return 'list';
  }
  if (state.slugLength === 1) {
    return 'animal';
  }
  return 'home';
}
