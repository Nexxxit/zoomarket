'use client';

import { useCallback, useMemo, useState } from 'react';
import { MOCK_PRODUCTS } from '@/entities/product';
import type { Product } from '@/entities/product';

const MAX_DROPDOWN_RESULTS = 5;

export interface HeaderSearchState {
  query: string;
  setQuery: (value: string) => void;
  results: Product[];
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  reset: () => void;
}

export function useHeaderSearch(): HeaderSearchState {
  const [query, setQueryValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const allResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return MOCK_PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        Boolean(product.brand?.toLowerCase().includes(q)) ||
        product.category.toLowerCase().includes(q) ||
        Boolean(product.subSection?.toLowerCase().includes(q)),
    );
  }, [query]);

  const results = useMemo(
    () => allResults.slice(0, MAX_DROPDOWN_RESULTS),
    [allResults],
  );

  const isOpen = isFocused && query.trim().length > 0;

  const setQuery = useCallback((value: string) => {
    setQueryValue(value);
    setIsFocused(true);
  }, []);

  const open = useCallback(() => setIsFocused(true), []);
  const close = useCallback(() => setIsFocused(false), []);
  const reset = useCallback(() => {
    setQueryValue('');
    setIsFocused(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    total: allResults.length,
    isOpen,
    open,
    close,
    reset,
  };
}
