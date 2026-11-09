'use client';

import CatalogShell from '../_components/CatalogShell';
import CatalogHomeView from '../_components/CatalogHomeView';
import CatalogAnimalView from '../_components/CatalogAnimalView';
import CatalogListView from '../_components/CatalogListView';
import CatalogProductView from '../_components/CatalogProductView';
import { useCatalogViewModel } from './useCatalogViewModel';

interface CatalogPageProps {
  slug: string[];
}

export default function CatalogPage({ slug }: CatalogPageProps) {
  const viewModel = useCatalogViewModel(slug);

  switch (viewModel.view) {
    case 'detail':
      return <CatalogProductView viewModel={viewModel} />;

    case 'animal':
      return (
        <CatalogShell>
          <CatalogAnimalView
            selectedAnimal={viewModel.state.animal}
            onSelectSubcategory={viewModel.handleSelectSubcategory}
          />
        </CatalogShell>
      );

    case 'list':
      return (
        <CatalogShell>
          <CatalogListView viewModel={viewModel} />
        </CatalogShell>
      );

    case 'home':
    default:
      return (
        <CatalogShell>
          <CatalogHomeView />
        </CatalogShell>
      );
  }
}
