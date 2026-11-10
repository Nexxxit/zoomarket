'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

interface CatalogQuerySyncProps {
  onQueryChange: (params: URLSearchParams) => void;
}

/**
 * Leaf-синхронизатор URL→состояние фильтров. Отдельный лист под Suspense —
 * по той же причине, что и HeroSearchPauseGate: useSearchParams на уровне
 * страницы отключает prerender. Интеграция Next слушает и router.push, и
 * popstate, и window.history.replaceState, поэтому поиск с уже открытого
 * каталога перестаёт быть no-op, а Back/Forward перечитывают фильтры.
 */
export default function CatalogQuerySync({ onQueryChange }: CatalogQuerySyncProps) {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!searchParams) return;
    onQueryChange(searchParams);
  }, [searchParams, onQueryChange]);

  return null;
}
