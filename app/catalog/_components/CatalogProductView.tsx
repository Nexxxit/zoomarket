'use client';

import React from 'react';
import ProductDetailView from './ProductDetailView';
import CatalogShell from './CatalogShell';
import type { CatalogViewModel } from '../[...slug]/useCatalogViewModel';

interface CatalogProductViewProps {
  viewModel: CatalogViewModel;
}

export default function CatalogProductView({ viewModel }: CatalogProductViewProps) {
  const {
    activeProduct,
    slug,
    liked,
    activeSize,
    activeProductQty,
    displayRating,
    displayReviews,
    userRating,
    recentlyViewedProducts,
    handleSelectSize,
    handleAddToCart,
    handleIncrementQty,
    handleDecrementQty,
    handleToggleFavorite,
    handleSelectRating,
  } = viewModel;

  if (!activeProduct) return null;

  return (
    <CatalogShell showHero={false}>
      <ProductDetailView
        activeProduct={activeProduct}
        slug={slug}
        liked={liked}
        activeSize={activeSize}
        activeProductQty={activeProductQty}
        displayRating={displayRating}
        displayReviews={displayReviews}
        userRating={userRating}
        recentlyViewedProducts={recentlyViewedProducts}
        onSelectSize={handleSelectSize}
        onAddToCart={handleAddToCart}
        onIncrementQty={handleIncrementQty}
        onDecrementQty={handleDecrementQty}
        onToggleFavorite={handleToggleFavorite}
        onRateProduct={handleSelectRating}
      />
    </CatalogShell>
  );
}
