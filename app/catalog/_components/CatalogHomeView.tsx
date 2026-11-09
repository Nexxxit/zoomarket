'use client';

import React from 'react';
import { HomeCategoryTiles } from '@/features/catalog';
import HomeFeaturesBar from './HomeFeaturesBar';

export default function CatalogHomeView() {
  return (
    <>
      <HomeFeaturesBar />

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
    </>
  );
}
