'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import DeliveryForm from './_components/DeliveryForm';
import CourierPanel from './_components/CourierPanel';

export default function DeliveryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">

        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-500 font-comfortaa transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Назад в каталог</span>
          </Link>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-orange-500 font-comfortaa text-xs font-bold uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full">
            Курьерская Служба
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-950 font-comfortaa tracking-tight">
            Оформить доставку Айболита
          </h1>
          <p className="text-sm text-stone-500 font-inter leading-relaxed">
            Доставим лечебные корма, капли, ошейники и игрушки прямо к вашей двери. Оставьте заявку ниже, наши логисты составят лучший экологический маршрут.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          <DeliveryForm />

          <CourierPanel />

        </div>
      </main>

      <Footer />
    </div>
  );
}
