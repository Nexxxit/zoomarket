'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEMO_FAVORITE_IDS } from '@/entities/product';
import { FavoritesContext } from './favoritesContext';
import { toggleFavoriteId, parseStoredFavorites } from './favorites';

const STORAGE_KEY = 'aibolit_favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(DEMO_FAVORITE_IDS);
  const favoritesRef = useRef<string[]>(favorites);

  useEffect(() => {
    const timer = setTimeout(() => {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        console.error('Error reading localStorage', e);
      }
      const stored = parseStoredFavorites(raw);
      if (stored) {
        favoritesRef.current = stored;
        setFavorites(stored);
      }
    }, 0);
    return () => clearTimeout(timer);
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

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites],
  );

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite }),
    [favorites, toggleFavorite, isFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
