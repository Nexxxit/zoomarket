'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CATALOG_STRUCTURE } from '@/entities/catalog';
import type { Product } from '@/entities/product';

export interface CatalogBreadcrumbsProps {
  slug: string[];
  isBrandsCatalog: boolean;
  activeBrandName: string | null;
  activeSubSection: string;
  activeSubcategory: { name: string } | null;
  activeProduct?: Product | null;
}

/** Active Breadcrumbs (URL level visualization) — click-навигация убрана, хлебные крошки статичны. */
export function CatalogBreadcrumbs({
  slug,
  isBrandsCatalog,
  activeBrandName,
  activeSubSection,
  activeSubcategory,
  activeProduct,
}: CatalogBreadcrumbsProps) {
  if (slug.length === 0) return null;

  return (
    <div className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500 font-comfortaa bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 w-fit">
      {slug.length >= 1 && (
        <button className="hover:text-orange-500 font-bold capitalize bg-transparent border-none p-0 cursor-pointer">
          {isBrandsCatalog ? 'Бренды' : (CATALOG_STRUCTURE[slug[0]]?.name || slug[0])}
        </button>
      )}
      {isBrandsCatalog && activeBrandName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-orange-500">{activeBrandName}</span>
        </>
      )}
      {!isBrandsCatalog && slug.length >= 2 && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <button className="hover:text-orange-500 font-bold bg-transparent border-none p-0 cursor-pointer">
            {activeSubcategory?.name || slug[1]}
          </button>
        </>
      )}
      {!isBrandsCatalog && slug.length >= 3 && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          {slug.length === 3 ? (
            <span className="font-semibold text-orange-500">{activeSubSection}</span>
          ) : (
            <button className="hover:text-orange-500 font-bold bg-transparent border-none p-0 cursor-pointer">
              {activeSubSection}
            </button>
          )}
        </>
      )}
      {!isBrandsCatalog && slug.length >= 4 && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-orange-500 max-w-[140px] truncate">{activeProduct?.name || slug[3]}</span>
        </>
      )}
    </div>
  );
}
