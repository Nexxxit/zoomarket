'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getProductById } from '@/entities/product';
import { RatingsContext } from './ratingContext';
import type { RatingsContextValue } from './ratingContext';
import type { ProductRatingsByProductId } from './productRatings';
import { applyProductRating, parseStoredProductRatings } from './productRatings';

const STORAGE_KEY = 'aibolit_product_ratings';

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const [productRatings, setProductRatings] = useState<ProductRatingsByProductId>({});
  const productRatingsRef = useRef<ProductRatingsByProductId>(productRatings);

  useEffect(() => {
    const timer = setTimeout(() => {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        console.error('Error reading localStorage', e);
      }
      const stored = parseStoredProductRatings(raw);
      if (stored) {
        productRatingsRef.current = stored;
        setProductRatings(stored);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const submitProductRating = useCallback((productId: string, rating: number) => {
    const product = getProductById(productId);
    const base = product
      ? { rating: product.rating, reviews: product.reviews }
      : { rating: 5.0, reviews: 0 };

    const next = applyProductRating(productRatingsRef.current, productId, rating, base);
    productRatingsRef.current = next;
    setProductRatings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Error writing localStorage', e);
    }
  }, []);

  const value = useMemo<RatingsContextValue>(
    () => ({ productRatings, submitProductRating }),
    [productRatings, submitProductRating],
  );

  return <RatingsContext.Provider value={value}>{children}</RatingsContext.Provider>;
}
