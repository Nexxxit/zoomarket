'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Breadcrumbs } from '@/shared/ui';
import FiltersSidebar from './FiltersSidebar';
import SubcategoryPills from './SubcategoryPills';
import SortBar from './SortBar';
import ProductGrid from './ProductGrid';
import type { CatalogViewModel } from '../[...slug]/useCatalogViewModel';

interface CatalogListViewProps {
  viewModel: CatalogViewModel;
}

export default function CatalogListView({ viewModel }: CatalogListViewProps) {
  const {
    slug,
    state,
    filters,
    isSearchActive,
    activeSubcategory,
    catalogTitle,
    filteredProducts,
    categoryBaseProducts,
    availableBrandsInSubcategory,
    onSaleCount,
    backToParam,
    navigateToSlug,
    updateFilters,
    resetFilters,
    breadcrumbs,
  } = viewModel;

  return (
    <section id="large-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">

      <div className="flex flex-col gap-3.5 border-b border-stone-150 pb-5">

        <Breadcrumbs items={breadcrumbs} onNavigate={navigateToSlug} />

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-comfortaa tracking-tight">
            {catalogTitle}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {slug.length < 4 && (
          <aside className="lg:col-span-3 space-y-6">

            <FiltersSidebar
              filters={filters}
              brandFacets={availableBrandsInSubcategory}
              onSaleCount={onSaleCount}
              onToggleOnSale={() => updateFilters({ onSaleOnly: !filters.onSaleOnly })}
              onPriceMinChange={(value) => updateFilters({ priceMin: value })}
              onPriceMaxChange={(value) => updateFilters({ priceMax: value })}
              onToggleBrand={(name) => updateFilters({
                brands: filters.brands.includes(name)
                  ? filters.brands.filter((brand) => brand !== name)
                  : [...filters.brands, name],
              })}
              onReset={resetFilters}
            />

          </aside>
        )}

        <div className={`${slug.length < 4 ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6`}>

          <AnimatePresence mode="wait">

          {(slug.length >= 2 || isSearchActive) && (
            <motion.div
              key={slug.join('/') || 'search'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >

              {slug.length >= 2 && activeSubcategory && !isSearchActive && (
                <SubcategoryPills
                  activeSubcategory={activeSubcategory}
                  activeSubSection={state.subSection}
                  animal={slug[0]}
                  onNavigate={navigateToSlug}
                />
              )}

              <SortBar
                count={filteredProducts.length}
                sortType={filters.sortType}
                onSortChange={(sortType) => updateFilters({ sortType })}
              />

              <ProductGrid
                categoryBaseProducts={categoryBaseProducts}
                filteredProducts={filteredProducts}
                isBrandsCatalog={state.isBrands}
                backTo={backToParam}
                onBackToCategory={() => navigateToSlug([slug[0]])}
                onResetFilters={resetFilters}
              />

            </motion.div>
          )}

          </AnimatePresence>

        </div>

      </div>

    </section>
  );
}
