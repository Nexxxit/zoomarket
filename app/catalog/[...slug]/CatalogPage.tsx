'use client';

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CatalogShell from '../_components/CatalogShell';
import CatalogHomeView from '../_components/CatalogHomeView';
import CatalogAnimalView from '../_components/CatalogAnimalView';
import CatalogListView from '../_components/CatalogListView';
import CatalogProductView from '../_components/CatalogProductView';
import CatalogQuerySync from '../_components/CatalogQuerySync';
import { useCatalogViewModel } from './useCatalogViewModel';

interface CatalogPageProps {
  slug: string[];
}

export default function CatalogPage({ slug }: CatalogPageProps) {
  const viewModel = useCatalogViewModel(slug);

  // 4-сегментный slug без найденного товара — 404, а не «список вместо
  // детали» (серверный guard в page.tsx ловит прямой заход, этот — client-навигацию).
  if (viewModel.state.slugLength === 4 && viewModel.state.productId && !viewModel.activeProduct) {
    notFound();
  }

  switch (viewModel.view) {
    case 'detail':
      return <CatalogProductView viewModel={viewModel} />;

    case 'animal':
      return (
        <CatalogShell>
          <Suspense fallback={null}>
            <CatalogQuerySync onQueryChange={viewModel.filtersFromQuery} />
          </Suspense>
          <CatalogAnimalView
            selectedAnimal={viewModel.state.animal}
            onSelectSubcategory={viewModel.handleSelectSubcategory}
          />
        </CatalogShell>
      );

    case 'list':
      return (
        <CatalogShell>
          <Suspense fallback={null}>
            <CatalogQuerySync onQueryChange={viewModel.filtersFromQuery} />
          </Suspense>
          <CatalogListView viewModel={viewModel} />
        </CatalogShell>
      );

    case 'home':
    default:
      return (
        <CatalogShell>
          <Suspense fallback={null}>
            <CatalogQuerySync onQueryChange={viewModel.filtersFromQuery} />
          </Suspense>
          <CatalogHomeView />
        </CatalogShell>
      );
  }
}
