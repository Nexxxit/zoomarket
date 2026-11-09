'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { Product } from '@/entities/product';
import ProductDetailTopBar from './ProductDetailTopBar';
import ProductImagePanel from './ProductImagePanel';
import ProductTitleBlock from './ProductTitleBlock';
import ProductSizeSelector from './ProductSizeSelector';
import ProductPurchaseBox from './ProductPurchaseBox';
import ProductDeliveryInfo from './ProductDeliveryInfo';
import ProductDescription from './ProductDescription';
import ProductRatingBlock from './ProductRatingBlock';
import RecentlyViewed from './RecentlyViewed';

interface ProductDetailViewProps {
  activeProduct: Product;
  slug: string[];
  liked: boolean;
  activeSize?: string;
  activeProductQty: number;
  displayRating: number;
  displayReviews: number;
  userRating?: number;
  recentlyViewedProducts: Product[];
  onSelectSize?: (size: string) => void;
  onAddToCart?: () => void;
  onIncrementQty?: () => void;
  onDecrementQty?: () => void;
  onToggleFavorite?: () => void;
  onRateProduct?: (rating: number) => void;
}

export default function ProductDetailView({
  activeProduct,
  slug,
  liked,
  activeSize,
  activeProductQty,
  displayRating,
  displayReviews,
  userRating,
  recentlyViewedProducts,
  onSelectSize,
  onAddToCart,
  onIncrementQty,
  onDecrementQty,
  onToggleFavorite,
  onRateProduct,
}: ProductDetailViewProps) {
  return (
    <main className="grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      <motion.div
        key="product-detail-view"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10 md:space-y-14"
      >

        <ProductDetailTopBar slug={slug} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

          <ProductImagePanel product={activeProduct} />

          <div className="space-y-6">
            <ProductTitleBlock
              product={activeProduct}
              displayRating={displayRating}
              displayReviews={displayReviews}
            />

            <div className="border-t border-stone-100" />

            <ProductSizeSelector
              sizes={activeProduct.sizes}
              activeSize={activeSize}
              onSelectSize={onSelectSize}
            />

            <ProductPurchaseBox
              product={activeProduct}
              qty={activeProductQty}
              liked={liked}
              onAddToCart={onAddToCart}
              onIncrement={onIncrementQty}
              onDecrement={onDecrementQty}
              onToggleFavorite={onToggleFavorite}
            />

            <ProductDeliveryInfo />
          </div>
        </div>

        <ProductDescription product={activeProduct} />

        <ProductRatingBlock
          userRating={userRating}
          onRate={onRateProduct}
        />

        <RecentlyViewed products={recentlyViewedProducts} />

      </motion.div>
    </main>
  );
}
