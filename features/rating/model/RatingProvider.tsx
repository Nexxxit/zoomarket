'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  RatingsActionsContext,
  RatingsDataContext,
} from './ratingContext';
import type { RatingsActionsValue, RatingsDataValue } from './ratingContext';
import type { Product } from '@/entities/product';
import type { ProductRating, ProductRatingsByProductId } from './productRatings';
import { applyProductRating, parseStoredProductRatings } from './productRatings';

const STORAGE_KEY = 'aibolit_product_ratings';
const FALLBACK_BASE = { rating: 5.0, reviews: 0 };

// Базовый рейтинг берётся из каталога, но статический импорт entities/product
// протёк бы моками в layout-бандл (RatingProvider висит над всем деревом).
// Каталог догружается один раз при первой оценке; до этого оценка применяется
// оптимистично с нейтральным base и пересчитывается по настоящему base.
// TODO(API): фаза 5 — агрегат возвращает сервер.
let productByIdLoader: Promise<(id: string) => Product | null> | null = null;
let catalogReady = false;

function loadProductById(): Promise<(id: string) => Product | null> {
  if (!productByIdLoader) {
    productByIdLoader = import('@/entities/product')
      .then((m) => m.getProductById)
      .catch((e) => {
        console.error('Failed to load product catalog for rating', e);
        return (): Product | null => null;
      });
  }
  return productByIdLoader;
}

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const [productRatings, setProductRatings] = useState<ProductRatingsByProductId>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const productRatingsRef = useRef<ProductRatingsByProductId>(productRatings);

  // Синхронное чтение в useEffect (без setTimeout-тика); постановка state —
  // в микрозадаче (до paint), dependent UI гейтится isHydrated.
  useEffect(() => {
    let cancelled = false;
    const hydrate = () => {
      if (cancelled) return;
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        console.error('Error reading localStorage', e);
      }
      const stored = parseStoredProductRatings(raw);
      if (stored) {
        productRatingsRef.current = stored;
      }
      setProductRatings(stored ?? {});
      setIsHydrated(true);
    };
    queueMicrotask(hydrate);
    return () => {
      cancelled = true;
    };
  }, []);

  // Оптимистичные оценки до прихода каталога: productId → { значение,
  // снимок store до первой оптимистичной записи }. При приходе чанка снимок
  // восстанавливается и оценка пересчитывается один раз от истинного base.
  const optimisticRef = useRef<Map<string, { rating: number; snapshot: ProductRating | null }>>(new Map());

  const applyRating = useCallback(
    (productId: string, rating: number, base: { rating: number; reviews: number }) => {
      const next = applyProductRating(productRatingsRef.current, productId, rating, base);
      productRatingsRef.current = next;
      setProductRatings(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Error writing localStorage', e);
      }
    },
    [],
  );

  const submitProductRating = useCallback((productId: string, rating: number) => {
    // Оптимистично: UI реагирует сразу (нейтральный base), без ожидания чанка.
    if (!catalogReady) {
      const existingEntry = productRatingsRef.current[productId] ?? null;
      const pending = optimisticRef.current.get(productId);
      if (pending) {
        pending.rating = rating;
      } else {
        optimisticRef.current.set(productId, { rating, snapshot: existingEntry });
      }
      applyRating(productId, rating, FALLBACK_BASE);
    }

    void loadProductById().then((getProductById) => {
      catalogReady = true;
      const product = getProductById(productId);
      const base = product
        ? { rating: product.rating, reviews: product.reviews }
        : FALLBACK_BASE;
      const optimistic = optimisticRef.current.get(productId);
      if (optimistic) {
        optimisticRef.current.delete(productId);
        // Откат оптимистичной записи и честный пересчёт от истинного base.
        const restored = { ...productRatingsRef.current };
        if (optimistic.snapshot === null) delete restored[productId];
        else restored[productId] = optimistic.snapshot;
        productRatingsRef.current = restored;
        applyRating(productId, optimistic.rating, base);
        return;
      }
      applyRating(productId, rating, base);
    });
  }, [applyRating]);

  const dataValue = useMemo<RatingsDataValue>(
    () => ({ productRatings, isHydrated }),
    [productRatings, isHydrated],
  );

  const actionsValue = useMemo<RatingsActionsValue>(
    () => ({ submitProductRating }),
    [submitProductRating],
  );

  return (
    <RatingsDataContext.Provider value={dataValue}>
      <RatingsActionsContext.Provider value={actionsValue}>
        {children}
      </RatingsActionsContext.Provider>
    </RatingsDataContext.Provider>
  );
}
