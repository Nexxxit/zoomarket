'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import PromoCarousel from './_components/PromoCarousel';
import HotDealsSection from './_components/HotDealsSection';
import GiftCoupon from './_components/GiftCoupon';

export default function PromotionsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">

        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-500 font-comfortaa transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Назад в каталог</span>
          </Link>
        </div>

        <PromoCarousel />

        <HotDealsSection />

        <GiftCoupon />

    </main>
  );
}
