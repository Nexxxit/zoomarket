'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEMO_FAVORITE_IDS } from '@/entities/product/model/demoFavorites';
import {
  FavoritesActionsContext,
  FavoritesDataContext,
} from './favoritesContext';
import type { FavoritesActionsValue, FavoritesDataValue } from './favoritesContext';
import { toggleFavoriteId, parseStoredFavorites } from './favorites';

const STORAGE_KEY = 'aibolit_favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(DEMO_FAVORITE_IDS);
  const [isHydrated, setIsHydrated] = useState(false);
  const favoritesRef = useRef<string[]>(favorites);

  // Синхронное чтение в useEffect (без setTimeout-тика). Тяжёлая часть —
  // только постановка state; микрозадача выполняется до paint, поэтому
  // dependent UI (сердечки карточек) не успевает показать demo-состояние.
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
      const stored = parseStoredFavorites(raw);
      if (stored) {
        favoritesRef.current = stored;
      }
      setFavorites(stored ?? DEMO_FAVORITE_IDS);
      setIsHydrated(true);
    };
    queueMicrotask(hydrate);
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    const next = toggleFavoriteId(favoritesRef.current, productId);
    favoritesRef.current = next;
    setFavorites(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Error writing localStorage', e);
    }
  }, []);

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const isFavorite = useCallback(
    (productId: string) => favoritesSet.has(productId),
    [favoritesSet],
  );

  const dataValue = useMemo<FavoritesDataValue>(
    () => ({ favorites, isFavorite, isHydrated }),
    [favorites, isFavorite, isHydrated],
  );

  const actionsValue = useMemo<FavoritesActionsValue>(
    () => ({ toggleFavorite }),
    [toggleFavorite],
  );

  return (
    <FavoritesDataContext.Provider value={dataValue}>
      <FavoritesActionsContext.Provider value={actionsValue}>
        {children}
      </FavoritesActionsContext.Provider>
    </FavoritesDataContext.Provider>
  );
}
