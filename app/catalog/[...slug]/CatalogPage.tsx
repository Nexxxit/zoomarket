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
import {
  decodeCatalogSlugSegment,
} from '@/shared/lib';
import { VirtualizedCatalogContainer, HomeCategoryTiles } from '@/features/catalog';
import HeroCarousel from '../_components/HeroCarousel';
import PromoSectionDisabled from '../_components/PromoSectionDisabled';
import { CatalogBreadcrumbs } from '../_components/Breadcrumbs';
import FiltersSidebar from '../_components/FiltersSidebar';
import SubcategoryPills from '../_components/SubcategoryPills';
import SortBar from '../_components/SortBar';
import ProductGrid from '../_components/ProductGrid';
import ProductDetailView from '../_components/ProductDetailView';

type PetType = 'cat' | 'dog' | 'bird' | 'rodent' | 'fish';

interface CatalogProps {
  params: Promise<{ slug?: string[] }>;
}

function CatalogPageContent({ params }: CatalogProps) {
  const { slug = [] } = React.use(params);

  const selectedAnimal: PetType = (slug[0] as PetType) || 'cat';
  const isBrandsCatalog = slug[0] === 'brands';
  const isVetCatalog = slug[0] === 'vet';
  const activeBrandName = isBrandsCatalog && slug[1]
    ? decodeCatalogSlugSegment(slug[1])
    : null;
  const activeSubcategoryId: string | null = isBrandsCatalog ? null : (slug[1] || null);
  const activeSubSection: string = isBrandsCatalog
    ? 'all'
    : (slug[2] ? decodeCatalogSlugSegment(slug[2]) : 'all');

  const isVetProduct = (product: (typeof MOCK_PRODUCTS)[number]) =>
    product.type === 'medicine' || Boolean(product.subcategoryId?.includes('flea'));

  const matchesVetSubcategory = (product: (typeof MOCK_PRODUCTS)[number]) => {
    if (!activeSubcategoryId) return true;
    if (activeSubcategoryId === 'vet-flea') {
      return Boolean(product.subcategoryId?.includes('flea'));
    }
    if (activeSubcategoryId === 'vet-vitamins' || activeSubcategoryId === 'vet-care') {
      return product.type === 'medicine' && !product.subcategoryId?.includes('flea');
    }
    return product.subcategoryId === activeSubcategoryId;
  };

  const matchesVetSubSection = (product: (typeof MOCK_PRODUCTS)[number]) => {
    if (activeSubSection === 'all') return true;
    if (!product.subSection) return false;

    const aliasesByPill: Record<string, string[]> = {
      'Капли на холку': ['Капли на холку', 'Капли от клещей', 'Капли от внешних паразитов'],
      'Ошейники от паразитов': ['Ошейники от паразитов', 'Ошейники защитные'],
      'Спреи': ['Спреи', 'Шампуни гигиенические'],
      'Таблетки комплексные': ['Таблетки комплексные'],
    };

    const aliases = aliasesByPill[activeSubSection] ?? [activeSubSection];
    return aliases.includes(product.subSection);
  };

  const priceMin = '' as string;
  const priceMax = '' as string;
  const selectedBrands = [] as string[];
  const onSaleOnly = false as boolean;
  const badgeFilterOnly = false as boolean;
  const sortType = 'popular' as 'popular' | 'cheap-first' | 'expensive-first';
  const fromSource = '' as string;

  const activeProduct = slug.length >= 4
    ? MOCK_PRODUCTS.find(p => p.id === slug[3])
    : null;

  const isCatalogLoading = false;

  const displayRating = activeProduct ? activeProduct.rating : 0;
  const displayReviews = activeProduct ? activeProduct.reviews : 0;
  const userRating: number | undefined = undefined;

  const userSelectedSize = null as { prodId: string, size: string } | null;
  const showRatingSuccess = false;

  const activeSize = (() => {
    if (!activeProduct) return '';
    if (userSelectedSize?.prodId === activeProduct.id) {
      return userSelectedSize.size;
    }
    return activeProduct.sizes?.[2] || activeProduct.sizes?.[0] || '';
  })();

  const liked = activeProduct ? DEMO_FAVORITE_IDS.includes(activeProduct.id) : false;

  const activeProductCartItem = INITIAL_CART_ITEMS.find(
    item => activeProduct && item.id === activeProduct.id && item.size === activeSize
  );
  const activeProductQty = activeProductCartItem ? activeProductCartItem.quantity : 0;

  const searchParamValue = '' as string;
  const isSearchActive = false as boolean;

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    if (searchParamValue) {
      const q = searchParamValue.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.subSection && product.subSection.toLowerCase().includes(q)) ||
        (product.animal === 'cat' && 'кошка кошачий кот котята'.includes(q)) ||
        (product.animal === 'dog' && 'собака собачий пес щенок'.includes(q));

      if (!matchesSearch) return false;
    }

    const hasSlugAnimal = slug.length > 0;
    if (isBrandsCatalog) {
      if (activeBrandName && product.brand !== activeBrandName) return false;
    } else if (isVetCatalog) {
      if (!isVetProduct(product)) return false;
      if (!matchesVetSubcategory(product)) return false;
    } else if ((hasSlugAnimal || !searchParamValue) && product.animal !== selectedAnimal) {
      return false;
    }

    if (!isBrandsCatalog && !isVetCatalog && activeSubcategoryId && product.subcategoryId !== activeSubcategoryId) return false;

    if (isVetCatalog) {
      if (!matchesVetSubSection(product)) return false;
    } else if (!isBrandsCatalog && activeSubSection !== 'all' && product.subSection !== activeSubSection) {
      return false;
    }

    if (onSaleOnly && !product.onSale) return false;

    if (badgeFilterOnly && !product.badge) return false;

    const price = product.price;
    if (priceMin !== '') {
      const min = parseFloat(priceMin);
      if (!isNaN(min) && price < min) return false;
    }
    if (priceMax !== '') {
      const max = parseFloat(priceMax);
      if (!isNaN(max) && price > max) return false;
    }

    if (selectedBrands.length > 0) {
      if (!product.brand || !selectedBrands.includes(product.brand)) return false;
    }

    return true;
  });

  const categoryBaseProducts = MOCK_PRODUCTS.filter(product => {
    if (isBrandsCatalog) {
      if (activeBrandName && product.brand !== activeBrandName) return false;
      return true;
    }
    if (isVetCatalog) {
      if (!isVetProduct(product)) return false;
      if (!matchesVetSubcategory(product)) return false;
      if (!matchesVetSubSection(product)) return false;
      return true;
    }
    const hasSlugAnimal = slug.length > 0;
    if (hasSlugAnimal && product.animal !== selectedAnimal) return false;
    if (activeSubcategoryId && product.subcategoryId !== activeSubcategoryId) return false;
    if (activeSubSection !== 'all' && product.subSection !== activeSubSection) return false;
    return true;
  });

  if (sortType === 'cheap-first') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'expensive-first') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  const activeSubcategory = activeSubcategoryId
    ? Object.values(CATALOG_STRUCTURE)
      .flatMap(group => group.subcategories)
      .find(sub => sub.id === activeSubcategoryId)
    : null;

  const availableBrandsInSubcategory = (() => {
    const brandsMap: Record<string, number> = {};
    MOCK_PRODUCTS.forEach(p => {
      let matchesScope = false;
      if (isBrandsCatalog) {
        matchesScope = !activeBrandName || p.brand === activeBrandName;
      } else if (isVetCatalog) {
        matchesScope = isVetProduct(p) && matchesVetSubcategory(p);
      } else {
        matchesScope = p.animal === selectedAnimal && (!activeSubcategoryId || p.subcategoryId === activeSubcategoryId);
      }

      if (matchesScope && p.brand) {
        brandsMap[p.brand] = (brandsMap[p.brand] || 0) + 1;
      }
    });
    return Object.entries(brandsMap).map(([name, count]) => ({ name, count }));
  })();

  const onSaleCount = MOCK_PRODUCTS.filter(p => {
    if (isBrandsCatalog) {
      return (!activeBrandName || p.brand === activeBrandName) && p.onSale;
    }
    if (isVetCatalog) {
      return isVetProduct(p) && matchesVetSubcategory(p) && p.onSale;
    }
    return p.animal === selectedAnimal && (!activeSubcategoryId || p.subcategoryId === activeSubcategoryId) && p.onSale;
  }).length;

  const recentlyViewed: string[] = [];

  const recentlyViewedProducts: Product[] = (() => {
    const viewed = MOCK_PRODUCTS.filter(p => recentlyViewed.includes(p.id) && p.id !== activeProduct?.id);
    if (viewed.length < 8 && activeProduct) {
      const extra = MOCK_PRODUCTS.filter(
        p => p.animal === activeProduct.animal && p.id !== activeProduct.id && !viewed.some(v => v.id === p.id)
      ).slice(0, 8 - viewed.length);
      return [...viewed, ...extra];
    }
    return viewed;
  })();

  if (slug.length === 4 && activeProduct) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
        <Header />

        <ProductDetailView
          activeProduct={activeProduct}
          fromSource={fromSource}
          activeSubSection={activeSubSection}
          activeSubcategory={activeSubcategory ?? null}
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

      {false && <PromoSectionDisabled slugLength={slug.length} isSearchActive={isSearchActive} />}

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
            selectedAnimal={slug[0]}
          />
        </section>
      ) : (
        <section id="large-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">

          <div className="flex flex-col gap-3.5 border-b border-stone-150 pb-5">

            <CatalogBreadcrumbs
              slug={slug}
              isBrandsCatalog={isBrandsCatalog}
              activeBrandName={activeBrandName}
              activeSubSection={activeSubSection}
              activeSubcategory={activeSubcategory ?? null}
              activeProduct={activeProduct}
            />

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-comfortaa tracking-tight">
                {(() => {
                  const animalName = CATALOG_STRUCTURE[selectedAnimal]?.name;

                  let targetAnimal = 'питомцев';
                  if (selectedAnimal === 'cat') targetAnimal = 'кошек';
                  else if (selectedAnimal === 'dog') targetAnimal = 'собак';
                  else if (selectedAnimal === 'bird') targetAnimal = 'птиц';
                  else if (selectedAnimal === 'rodent') targetAnimal = 'грызунов';
                  else if (selectedAnimal === 'fish') targetAnimal = 'рыб';

                  if (slug.length === 0) {
                    return searchParamValue
                      ? `Результаты поиска по запросу «${searchParamValue}»`
                      : 'Каталог товаров зоомаркета';
                  }
                  if (isBrandsCatalog) {
                    if (activeBrandName) {
                      return `Товары бренда ${activeBrandName}`;
                    }
                    return 'Бренды';
                  }
                  if (slug.length === 1) {
                    return `Товары для ${targetAnimal}`;
                  }
                  if (slug.length >= 4 && activeProduct) {
                    return activeProduct.brand ? `Товар бренда ${activeProduct.brand}` : 'Карточка товара';
                  }
                  if (activeSubcategory) {
                    if (activeSubSection !== 'all') {
                      return `${activeSubSection} для ${targetAnimal}`;
                    }
                    return `${activeSubcategory.name} для ${targetAnimal}`;
                  }
                  return 'Каталог зоомаркета';
                })()}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {slug.length < 4 && (
              <aside className="lg:col-span-3 space-y-6">

                {true && (
                  <FiltersSidebar
                    priceMin={priceMin}
                    priceMax={priceMax}
                    selectedBrands={selectedBrands}
                    onSaleOnly={onSaleOnly}
                    badgeFilterOnly={badgeFilterOnly}
                    onSaleCount={onSaleCount}
                    availableBrandsInSubcategory={availableBrandsInSubcategory}
                  />
                )}

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
                      activeSubSection={activeSubSection}
                    />
                  )}

                  <SortBar count={filteredProducts.length} sortType={sortType} />

                  <ProductGrid
                    isCatalogLoading={isCatalogLoading}
                    categoryBaseProducts={categoryBaseProducts}
                    filteredProducts={filteredProducts}
                    isBrandsCatalog={isBrandsCatalog}
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
