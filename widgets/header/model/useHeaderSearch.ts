'use client';

import { useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  goToResults: () => void;
}

export function useHeaderSearch(): HeaderSearchState {
  const router = useRouter();
  const [query, setQueryValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Индекс моков (entities/product/api) грузится по требованию — при фокусе
  // поля, а не в initial-бандле layout/Header: моки каталога не весят на
  // первую загрузку каждой страницы. Повтор после сбоя — только при следующем
  // фокусе (не на каждый символ).
  // TODO(API): после переезда поиска на сервер (фаза 5) заменится на запрос
  // `GET /search?q=`.
  const [index, setIndex] = useState<Product[] | null>(null);
  const indexRequestedRef = useRef(false);
  const ensureIndex = useCallback(() => {
    if (indexRequestedRef.current) return;
    indexRequestedRef.current = true;
    import('@/entities/product')
      .then((m) => setIndex(m.getAllProducts()))
      .catch(() => {
        indexRequestedRef.current = false;
      });
  }, []);

  // Тяжёлый фильтр по каталогу уходит в отложенный переход: ввод остаётся
  // отзывчивым, дропдаун догоняет.
  const deferredQuery = useDeferredValue(query);

  const allResults = useMemo(() => {
    if (!index) return [];
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return [];

    return index.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        Boolean(product.brand?.toLowerCase().includes(q)) ||
        product.category.toLowerCase().includes(q) ||
        Boolean(product.subSection?.toLowerCase().includes(q)),
    );
  }, [index, deferredQuery]);

  const results = useMemo(
    () => allResults.slice(0, MAX_DROPDOWN_RESULTS),
    [allResults],
  );

  // До загрузки индекса дропдаун не открываем — иначе мигает «Ничего не найдено».
  const isOpen = index !== null && isFocused && deferredQuery.trim().length > 0;

  const setQuery = useCallback((value: string) => {
    setQueryValue(value);
    setIsFocused(true);
    if (!indexRequestedRef.current) ensureIndex();
  }, [ensureIndex]);

  const open = useCallback(() => {
    setIsFocused(true);
    ensureIndex();
  }, [ensureIndex]);
  const close = useCallback(() => setIsFocused(false), []);
  const reset = useCallback(() => {
    setQueryValue('');
    setIsFocused(false);
  }, []);
  const goToResults = useCallback(() => {
    const q = query.trim();
    setIsFocused(false);
    if (q) router.push(`/catalog?search=${encodeURIComponent(q)}`);
  }, [query, router]);

  return {
    query,
    setQuery,
    results,
    total: allResults.length,
    isOpen,
    open,
    close,
    reset,
    goToResults,
  };
}
