'use client';

import React from 'react';
import Image from 'next/image';
import {
  ArrowLeft, ShoppingCart, Heart, Truck, Award, Star,
  Plus, Minus,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '@/entities/product';
import { formatPrice } from '@/shared/lib/format';
import { useCartToast } from '@/features/cart';
import { StarRating } from '@/features/rating';
import RecentlyViewed from './RecentlyViewed';

interface ProductDetailViewProps {
  activeProduct: Product;
  fromSource: string;
  activeSubSection: string;
  activeSubcategory: { name: string } | null;
  liked: boolean;
  activeSize: string;
  activeProductQty: number;
  displayRating: number;
  displayReviews: number;
  userRating?: number;
  showRatingSuccess?: boolean;
  recentlyViewedProducts: Product[];
}

export default function ProductDetailView({
  activeProduct,
  fromSource,
  activeSubSection,
  activeSubcategory,
  liked,
  activeSize,
  activeProductQty,
  displayRating,
  displayReviews,
  userRating,
  showRatingSuccess = false,
  recentlyViewedProducts,
}: ProductDetailViewProps) {
  const { showToast } = useCartToast();
  return (

    <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        <motion.div
          key="product-detail-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-10 md:space-y-14"
        >

          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            <button
              className="inline-flex items-center gap-2 text-xs font-bold font-comfortaa text-stone-500 hover:text-stone-900 group cursor-pointer bg-transparent border-0 outline-none"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Назад в &ldquo;{fromSource === 'all' ? activeSubcategory?.name : (activeSubSection === 'all' ? activeSubcategory?.name : activeSubSection)}&rdquo;</span>
            </button>
            <span className="text-[10px] font-mono text-stone-400">ID товара: {activeProduct.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

            <div className="bg-stone-50 rounded-3xl p-8 flex items-center justify-center aspect-square border border-stone-100/50 relative overflow-hidden group">
              <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                {activeProduct.onSale && (
                  <span className="bg-orange-500 text-white text-xs font-black font-comfortaa px-3 py-1 rounded-full shadow-sm">
                    Скидка –{activeProduct.salePct}%
                  </span>
                )}
                {activeProduct.badge && (
                  <span className="bg-emerald-500 text-white text-xs font-black font-comfortaa px-3 py-1 rounded-full shadow-sm">
                    {activeProduct.badge}
                  </span>
                )}
              </div>
              <div className="scale-150 transform group-hover:scale-[1.75] transition-transform duration-500">
                <Image
                  src="/logo_aibolit.jpg"
                  alt={activeProduct.name}
                  width={144}
                  height={144}
                  className="w-36 h-36 object-cover rounded-full"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                {activeProduct.brand && (
                  <span className="text-xs font-bold text-orange-500 font-comfortaa uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                    {activeProduct.brand}
                  </span>
                )}
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-comfortaa leading-tight mt-2">
                  {activeProduct.name}
                </h1>

                <div className="flex items-center gap-4 text-xs font-medium text-stone-500 pt-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-stone-700 text-sm">{displayRating}</span>
                    <span>({displayReviews} отзывов)</span>
                  </div>
                  <span>•</span>
                  {activeProduct.inStock !== false ? (
                    <span className="text-emerald-600 font-bold">🐾 В наличии</span>
                  ) : (
                    <span className="text-rose-600 font-bold">❌ Нет в наличии</span>
                  )}
                </div>
              </div>

              <div className="border-t border-stone-100" />

              {activeProduct.sizes && activeProduct.sizes.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest font-comfortaa">Выберите фасовку / размер:</span>
                  <div className="flex flex-wrap gap-2">
                    {activeProduct.sizes.map((sz) => {
                      const isSel = activeSize === sz;
                      return (
                        <button
                          key={sz}
                          className={`px-4 py-2 text-xs font-bold font-comfortaa rounded-xl border transition-all cursor-pointer ${isSel
                            ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                            : 'bg-stone-50 border-stone-200/50 text-stone-600 hover:bg-stone-100'
                            }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-stone-50 border border-stone-100 rounded-3xl p-5 space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-orange-500 font-comfortaa">
                    {formatPrice(activeProduct.price)}
                  </span>
                  {activeProduct.onSale && activeProduct.oldPrice && (
                    <span className="text-sm sm:text-base text-stone-400 line-through font-inter">
                      {formatPrice(activeProduct.oldPrice)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {activeProductQty > 0 ? (
                    <div className="flex-1 flex items-center justify-between bg-white p-1 rounded-full border border-stone-200 shadow-xs h-[52px] px-2">
                      <button
                        className="w-10 h-10 rounded-full bg-stone-50 hover:bg-orange-50 hover:text-orange-500 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer border-0"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-base font-black text-stone-900 font-mono">
                        {activeProductQty} шт.
                      </span>
                      <button
                        className="w-10 h-10 rounded-full bg-stone-50 hover:bg-orange-50 hover:text-orange-500 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer border-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : activeProduct.inStock === false ? (
                    <button
                      disabled
                      className="flex-1 bg-stone-100 text-stone-400 font-bold font-comfortaa py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all text-sm cursor-not-allowed border-0 outline-none h-[52px]"
                    >
                      <span>Товар временно отсутствует</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => showToast(activeProduct)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 text-sm cursor-pointer border-0 outline-none h-[52px]"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Добавить в корзину</span>
                    </button>
                  )}
                  <button
                    className={`p-3.5 rounded-full border border-stone-200 transition-colors flex items-center justify-center cursor-pointer h-[52px] w-[52px] ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white text-stone-500 hover:bg-stone-50'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] font-inter text-stone-600">
                <div className="flex items-start gap-2 bg-stone-50/50 border border-stone-100 p-3 rounded-2xl">
                  <Truck className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-800 block">Быстрая доставка</span>
                    <span>Курьером на дом сегодня или завтра. Бесплатно от 2000₽.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-stone-50/50 border border-stone-100 p-3 rounded-2xl">
                  <Award className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-800 block">Забрать в магазине</span>
                    <span>Самовывоз через 30 минут из любого зоомаркета бесплатно.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-8 space-y-6">
            <h3 className="text-sm font-black font-comfortaa text-stone-900 uppercase tracking-wider">Описание и характеристики товара</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-3 text-xs leading-relaxed text-stone-600 font-inter">
                <p>
                  Высококачественный сбалансированный рацион класса супер-премиум разработан ведущими ветеринарными диетологами специально для вашего питомца. Содержит отборное свежее мясо, комплекс незаменимых витаминов и минералов, а также натуральные пребиотики для отличного пищеварения и крепкого иммунитета.
                </p>
                <p>
                  Уникальная рецептура бережно заботится о здоровье кожи и шерсти питомца благодаря оптимальному балансу жирных кислот Омега-3 и Омега-6. Хрустящие гранулы обеспечивают бережную механическую чистку зубов и профилактику зубного камня.
                </p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 font-inter space-y-2.5 text-xs text-stone-600">
                <span className="font-bold text-stone-800 block">Спецификация:</span>
                <div className="flex justify-between border-b border-stone-200/50 pb-1.5">
                  <span>Тип корма</span>
                  <span className="font-semibold text-stone-800">{activeProduct.type === 'food' ? 'Полнорационный' : 'Вспомогательный'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/50 pb-1.5">
                  <span>Животное</span>
                  <span className="font-semibold text-stone-800 capitalize">
                    {activeProduct.animal === 'cat' && 'Кошки'}
                    {activeProduct.animal === 'dog' && 'Собаки'}
                    {activeProduct.animal === 'bird' && 'Птицы'}
                    {activeProduct.animal === 'universal' && 'Универсальное'}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Класс товара</span>
                  <span className="font-semibold text-stone-800">Супер-Премиум / Холистик</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-8 pb-4 space-y-4">
            <h3 className="text-sm font-black font-comfortaa text-stone-900 uppercase tracking-wider">
              Оценка товара покупателями
            </h3>
            <div className="bg-stone-50 border border-stone-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-sm font-bold text-stone-800 block">Как вам этот товар?</span>
                <p className="text-xs text-stone-500 leading-relaxed max-w-md">
                  Поделитесь своим мнением о товаре с другими владельцами питомцев. Ваша оценка поможет сделать правильный выбор!
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <StarRating value={userRating ?? 0} />

                {userRating !== undefined ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                    <span>Ваша оценка: {userRating} из 5. Спасибо! 🐾</span>
                  </span>
                ) : showRatingSuccess ? (
                  <span className="text-xs font-bold text-orange-650 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 animate-pulse">
                    Оценка сохранена! 🎉
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-400 font-medium">
                    Нажмите на звезду, чтобы поставить оценку
                  </span>
                )}
              </div>
            </div>
          </div>

          <RecentlyViewed products={recentlyViewedProducts} />

        </motion.div>
    </main>
  );
}
