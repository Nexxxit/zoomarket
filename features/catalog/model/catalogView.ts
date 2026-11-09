import type { CatalogSlugState } from './types';

export type CatalogView = 'home' | 'animal' | 'list' | 'detail';

export interface CatalogViewInput {
  state: CatalogSlugState;
  isSearchActive: boolean;
  hasActiveProduct: boolean;
}

/**
 * Единственный источник истины о том, какой вид каталога показать.
 * Поведение 1:1 с оригинальной страницей: detail только при slug === 4
 * и найденном товаре; не найденный товар (в т.ч. slug > 4) остаётся 'list'.
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
