'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HOME_FEATURES,
} from '@/shared/config/site';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { Loader } from '@/shared/ui';
import { MOCK_PRODUCTS, DEMO_FAVORITE_IDS, INITIAL_CART_ITEMS } from '@/entities';
import type { Product } from '@/entities';
import { CATALOG_STRUCTURE } from '@/entities/catalog';
import type { Subcategory } from '@/entities/catalog';
import {
  VirtualizedCatalogContainer,
  HomeCategoryTiles,
  parseCatalogSlug,
  filterProducts,
  sortProducts,
  selectCategoryBaseProducts,
  buildBrandFacets,
  countOnSale,
  getCatalogTitle,
} from '@/features/catalog';
import type { FilterCriteria } from '@/features/catalog';
import HeroCarousel from '../_components/HeroCarousel';
// TODO(интерактив): вернуть после подключения реальных промо-данных —
// import PromoSectionDisabled from '../_components/PromoSectionDisabled';
import { CatalogBreadcrumbs } from '../_components/Breadcrumbs';
import FiltersSidebar from '../_components/FiltersSidebar';
import SubcategoryPills from '../_components/SubcategoryPills';
import SortBar from '../_components/SortBar';
import ProductGrid from '../_components/ProductGrid';
import ProductDetailView from '../_components/ProductDetailView';

interface CatalogProps {
  params: Promise<{ slug?: string[] }>;
}

const DEMO_FILTERS: FilterCriteria = {
  searchQuery: '',
  priceMin: '',
  priceMax: '',
  brands: [],
  onSaleOnly: false,
  badgeOnly: false,
  sortType: 'popular',
};

const DEMO_RECENTLY_VIEWED_IDS: string[] = [];

function CatalogPageContent({ params }: CatalogProps) {
  const { slug = [] } = React.use(params);

  const state = React.useMemo(() => parseCatalogSlug(slug), [slug]);
  const filters = DEMO_FILTERS;

  const isSearchActive = Boolean(filters.searchQuery);

  const activeProduct = state.productId
    ? MOCK_PRODUCTS.find(p => p.id === state.productId) ?? null
    : null;

  const activeSize = (() => {
    if (!activeProduct) return '';
    return activeProduct.sizes?.[2] || activeProduct.sizes?.[0] || '';
  })();

  const liked = activeProduct ? DEMO_FAVORITE_IDS.includes(activeProduct.id) : false;

  const activeProductCartItem = INITIAL_CART_ITEMS.find(
    item => activeProduct && item.id === activeProduct.id && item.size === activeSize
  );
  const activeProductQty = activeProductCartItem ? activeProductCartItem.quantity : 0;

  const filteredProducts = React.useMemo(
    () => sortProducts(filterProducts(MOCK_PRODUCTS, state, filters), filters.sortType),
    [state, filters],
  );

  const categoryBaseProducts = React.useMemo(
    () => selectCategoryBaseProducts(MOCK_PRODUCTS, state),
    [state],
  );

  const activeSubcategory = React.useMemo<Subcategory | null>(() => {
    if (!state.subcategoryId) return null;
    return (
      Object.values(CATALOG_STRUCTURE)
        .flatMap(group => group.subcategories)
        .find(sub => sub.id === state.subcategoryId) ?? null
    );
  }, [state]);

  const availableBrandsInSubcategory = React.useMemo(
    () => buildBrandFacets(MOCK_PRODUCTS, state),
    [state],
  );

  const onSaleCount = React.useMemo(() => countOnSale(MOCK_PRODUCTS, state), [state]);

  const recentlyViewedProducts: Product[] = React.useMemo(() => {
    const viewed = MOCK_PRODUCTS.filter(p => DEMO_RECENTLY_VIEWED_IDS.includes(p.id) && p.id !== activeProduct?.id);
    if (viewed.length < 8 && activeProduct) {
      const extra = MOCK_PRODUCTS.filter(
        p => p.animal === activeProduct.animal && p.id !== activeProduct.id && !viewed.some(v => v.id === p.id)
      ).slice(0, 8 - viewed.length);
      return [...viewed, ...extra];
    }
    return viewed;
  }, [activeProduct]);

  const catalogTitle = getCatalogTitle({
    state,
    searchQuery: filters.searchQuery,
    activeProduct,
    activeSubcategory,
  });

  const isCatalogLoading = false;
  const fromSource = '';

  const displayRating = activeProduct ? activeProduct.rating : 0;
  const displayReviews = activeProduct ? activeProduct.reviews : 0;
  const userRating: number | undefined = undefined;

  const showRatingSuccess = false;

  if (slug.length === 4 && activeProduct) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
        <Header />

        <ProductDetailView
          activeProduct={activeProduct}
          fromSource={fromSource}
          activeSubSection={state.subSection}
          activeSubcategory={activeSubcategory}
          liked={liked}
          activeSize={activeSize}
          activeProductQty={activeProductQty}
          displayRating={displayRating}
          displayReviews={displayReviews}
          userRating={userRating}
          showRatingSuccess={showRatingSuccess}
          recentlyViewedProducts={recentlyViewedProducts}
        />

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Header />

      <HeroCarousel />

      {slug.length === 0 && !isSearchActive && (
        <section aria-label="Преимущества магазина">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-7">
            <ul className="flex w-full flex-col gap-y-4 list-none m-0 p-0 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-5 lg:flex-nowrap lg:items-center lg:justify-between lg:gap-x-0">
              {HOME_FEATURES.map(({ id, icon: Icon, lines }) => (
                <li key={id} className="flex items-center gap-3 min-w-0 sm:basis-[calc(50%-1rem)] lg:basis-auto lg:shrink-0">
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-orange-50 shrink-0">
                    <Icon className="w-6 h-6 text-orange-500" strokeWidth={2} aria-hidden />
                  </div>
                  <p className="min-w-0 text-xs font-normal font-inter text-stone-700 leading-snug">
                    {lines[0]}
                    {lines[1] ? (
                      <>
                        {' '}
                        <span className="block">{lines[1]}</span>
                      </>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* TODO(интерактив): {false && <PromoSectionDisabled slugLength={slug.length} isSearchActive={isSearchActive} />} */}

      {slug.length === 0 && !isSearchActive ? (
        <section id="large-catalog" className="pt-2 sm:pt-4 pb-10 sm:pb-14 space-y-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-comfortaa tracking-tight uppercase">
                Каталог товаров зоомаркета
              </h2>
            </div>

            <HomeCategoryTiles />
          </div>
        </section>
      ) : slug.length === 1 && !isSearchActive ? (
        <section id="large-catalog" className="py-6 space-y-6">
          <VirtualizedCatalogContainer
            selectedAnimal={state.animal}
          />
        </section>
      ) : (
        <section id="large-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">

          <div className="flex flex-col gap-3.5 border-b border-stone-150 pb-5">

            <CatalogBreadcrumbs
              slug={slug}
              isBrandsCatalog={state.isBrands}
              activeBrandName={state.activeBrandName}
              activeSubSection={state.subSection}
              activeSubcategory={activeSubcategory}
              activeProduct={activeProduct}
            />

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
                  priceMin={filters.priceMin}
                  priceMax={filters.priceMax}
                  selectedBrands={filters.brands}
                  onSaleOnly={filters.onSaleOnly}
                  badgeFilterOnly={filters.badgeOnly}
                  onSaleCount={onSaleCount}
                  availableBrandsInSubcategory={availableBrandsInSubcategory}
                />

              </aside>
            )}

            <div className={`${slug.length === 4 ? 'lg:col-span-12' : 'lg:col-span-9'} space-y-6`}>

              <AnimatePresence mode="wait">

              {((slug.length >= 2 && slug.length <= 3) || isSearchActive) && (
                <motion.div
                  key="category-product-grid-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >

                  {slug.length >= 2 && activeSubcategory && !isSearchActive && (
                    <SubcategoryPills
                      activeSubcategory={activeSubcategory}
                      activeSubSection={state.subSection}
                    />
                  )}

                  <SortBar count={filteredProducts.length} sortType={filters.sortType} />

                  <ProductGrid
                    isCatalogLoading={isCatalogLoading}
                    categoryBaseProducts={categoryBaseProducts}
                    filteredProducts={filteredProducts}
                    isBrandsCatalog={state.isBrands}
                  />

                </motion.div>
              )}

              </AnimatePresence>

            </div>

          </div>

        </section>
      )}

      <Footer />
    </div>
  );
}

export default function CatalogPage(props: CatalogProps) {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader />
      </div>
    }>
      <CatalogPageContent {...props} />
    </React.Suspense>
  );
}
