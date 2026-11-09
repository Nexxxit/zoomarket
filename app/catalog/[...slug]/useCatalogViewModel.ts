'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getAllProducts, getProductById } from '@/entities';

import type { Product } from '@/entities';
import { getDefaultProductSize } from '@/entities/product';
import { CATALOG_STRUCTURE } from '@/entities/catalog';
import type { Subcategory } from '@/entities/catalog';
import { useCart } from '@/features/cart';
import { useFavorites } from '@/features/favorites';
import { useRatings, resolveProductRating } from '@/features/rating';
import { encodeCatalogSlugSegment } from '@/shared/lib';
import {
  parseCatalogSlug,
  filterProducts,
  sortProducts,
  selectCategoryBaseProducts,
  buildBrandFacets,
  countOnSale,
  getCatalogTitle,
  buildCatalogBreadcrumbs,
  resolveCatalogView,
  selectRecentlyViewed,
} from '@/features/catalog';
import type { FilterCriteria } from '@/features/catalog';

const DEMO_FILTERS: FilterCriteria = {
  searchQuery: '',
  priceMin: '',
  priceMax: '',
  brands: [],
  onSaleOnly: false,
  badgeOnly: false,
  sortType: 'popular',
};

const DEMO_RECENTLY_VIEWED_IDS: string[] = [];

/**
 * View-model страницы каталога: вся деривация данных из slug и фильтров.
 * Компоненты только рендерят результат, повторная деривация — здесь.
 * Query-параметр `from` (глубокая кнопка «Назад») читается в leaf-компоненте
 * ProductDetailTopBar под собственным Suspense — иначе useSearchParams на
 * этом уровне выключал бы prerender всей страницы.
 * TODO(интерактив): DEMO_* константы и getAllProducts/getProductById из
 * entities/product/api заменятся реальным стором каталога и API-данными.
 */
export function useCatalogViewModel(slug: string[]) {
  const router = useRouter();
  const { cart, addToCart, updateQty } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const state = React.useMemo(() => parseCatalogSlug(slug), [slug]);
  const filters = DEMO_FILTERS;
  const [userSelectedSize, setUserSelectedSize] = React.useState<{ prodId: string; size: string } | null>(null);

  const isSearchActive = Boolean(filters.searchQuery);

  const navigateToSlug = React.useCallback((segments: string[]) => {
    const path = `/catalog/${segments.map(encodeCatalogSlugSegment).join('/')}`;
    router.push(path, { scroll: false });
  }, [router]);

  const handleSelectSubcategory = React.useCallback((subId: string, categoryId: string, subSection?: string) => {
    if (subId === 'all') {
      navigateToSlug([categoryId]);
    } else if (subSection) {
      navigateToSlug([categoryId, subId, subSection]);
    } else {
      navigateToSlug([categoryId, subId]);
    }
  }, [navigateToSlug]);

  const activeProduct: Product | null = React.useMemo(
    () => (state.productId ? getProductById(state.productId) : null),
    [state],
  );

  const view = React.useMemo(
    () => resolveCatalogView({ state, isSearchActive, hasActiveProduct: Boolean(activeProduct) }),
    [state, isSearchActive, activeProduct],
  );

  const activeSize = React.useMemo(() => {
    if (!activeProduct) return undefined;
    if (userSelectedSize?.prodId === activeProduct.id) {
      return userSelectedSize.size;
    }
    return getDefaultProductSize(activeProduct);
  }, [activeProduct, userSelectedSize]);

  const handleSelectSize = React.useCallback((size: string) => {
    if (activeProduct) {
      setUserSelectedSize({ prodId: activeProduct.id, size });
    }
  }, [activeProduct]);

  const liked = activeProduct ? isFavorite(activeProduct.id) : false;

  const activeProductQty = React.useMemo(() => {
    const cartItem = cart.find(
      item => activeProduct && item.id === activeProduct.id && item.size === activeSize
    );
    return cartItem ? cartItem.quantity : 0;
  }, [cart, activeProduct, activeSize]);

  const filteredProducts = React.useMemo(
    () => sortProducts(filterProducts(getAllProducts(), state, filters), filters.sortType),
    [state, filters],
  );

  const categoryBaseProducts = React.useMemo(
    () => selectCategoryBaseProducts(getAllProducts(), state),
    [state],
  );

  const activeSubcategory = React.useMemo<Subcategory | null>(() => {
    if (!state.subcategoryId) return null;
    return (
      Object.values(CATALOG_STRUCTURE)
        .flatMap(group => group.subcategories)
        .find(sub => sub.id === state.subcategoryId) ?? null
    );
  }, [state]);

  const availableBrandsInSubcategory = React.useMemo(
    () => buildBrandFacets(getAllProducts(), state),
    [state],
  );

  const onSaleCount = React.useMemo(() => countOnSale(getAllProducts(), state), [state]);

  const recentlyViewedProducts = React.useMemo(
    () => selectRecentlyViewed(getAllProducts(), DEMO_RECENTLY_VIEWED_IDS, activeProduct),
    [activeProduct],
  );

  const catalogTitle = getCatalogTitle({
    state,
    searchQuery: filters.searchQuery,
    activeProduct,
    activeSubcategory,
  });

  const breadcrumbs = React.useMemo(
    () => buildCatalogBreadcrumbs({
      slug,
      state,
      subcategoryName: activeSubcategory?.name ?? null,
      productName: activeProduct?.name ?? null,
    }),
    [slug, state, activeSubcategory, activeProduct],
  );

  const backToParam = React.useMemo(() => slug.slice(0, 3).join('/'), [slug]);

  const handleAddToCart = React.useCallback(() => {
    if (activeProduct) addToCart(activeProduct, activeSize);
  }, [addToCart, activeProduct, activeSize]);

  const handleIncrementQty = React.useCallback(() => {
    if (activeProduct) updateQty(activeProduct.id, 1, activeSize);
  }, [updateQty, activeProduct, activeSize]);

  const handleDecrementQty = React.useCallback(() => {
    if (activeProduct) updateQty(activeProduct.id, -1, activeSize);
  }, [updateQty, activeProduct, activeSize]);

  const handleToggleFavorite = React.useCallback(() => {
    if (activeProduct) toggleFavorite(activeProduct.id);
  }, [toggleFavorite, activeProduct]);

  const { productRatings, submitProductRating } = useRatings();

  const activeProductRating = React.useMemo(
    () => (activeProduct ? resolveProductRating(productRatings, activeProduct) : null),
    [activeProduct, productRatings],
  );

  const displayRating = activeProductRating?.rating ?? 0;
  const displayReviews = activeProductRating?.reviews ?? 0;
  const userRating = activeProductRating?.userRating;

  const handleSelectRating = React.useCallback((rating: number) => {
    if (activeProduct) submitProductRating(activeProduct.id, rating);
  }, [activeProduct, submitProductRating]);

  return {
    slug,
    state,
    filters,
    view,
    isSearchActive,
    activeProduct,
    activeSize,
    liked,
    activeProductQty,
    filteredProducts,
    categoryBaseProducts,
    activeSubcategory,
    availableBrandsInSubcategory,
    onSaleCount,
    recentlyViewedProducts,
    catalogTitle,
    breadcrumbs,
    backToParam,
    displayRating,
    displayReviews,
    userRating,
    navigateToSlug,
    handleSelectSubcategory,
    handleSelectSize,
    handleAddToCart,
    handleIncrementQty,
    handleDecrementQty,
    handleToggleFavorite,
    handleSelectRating,
  };
}

export type CatalogViewModel = ReturnType<typeof useCatalogViewModel>;
