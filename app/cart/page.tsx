'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { LottiePlayer } from '@/shared/ui';
import { INITIAL_CART_ITEMS, DEMO_CHECKOUT_TYPE, DEMO_PICKUP_ADDRESS, selectSubtotal, selectOldSubtotal } from '@/entities/cart';
import { FREE_SHIPPING_THRESHOLD, DELIVERY_COST } from '@/shared/config/commerce';
import CartList from './_components/CartList';
import OrderSummary from './_components/OrderSummary';
import DeliveryTermsBlock from './_components/DeliveryTermsBlock';

export default function CartPage() {
  const cart = INITIAL_CART_ITEMS;
  const checkoutType = DEMO_CHECKOUT_TYPE;
  const pickupAddress = DEMO_PICKUP_ADDRESS;

  const promoDiscount = 0;
  const promoError: string | null = null;
  const promoSuccess: string | null = null;

  const itemsSubtotal = selectSubtotal(cart);
  const itemsOldSubtotal = selectOldSubtotal(cart);
  const totalSavings = itemsOldSubtotal - itemsSubtotal;

  const deliveryCost = checkoutType === 'delivery' ? (itemsSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_COST) : 0;
  const grandTotal = Math.max(0, itemsSubtotal - promoDiscount + deliveryCost);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">

        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-500 font-comfortaa transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Назад в каталог</span>
          </Link>
        </div>

        <section className="space-y-2 mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-comfortaa tracking-tight inline-flex items-center gap-2">
            <span>Ваша корзина</span>
            <span className="text-sm sm:text-base text-stone-400 font-sans font-bold">
              ({cart.length})
            </span>
          </h1>
        </section>

        <AnimatePresence mode="wait">

          {cart.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full bg-white rounded-[32px] p-8 md:p-16 border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6 py-16"
            >
              <div className="h-48 w-64 mx-auto">
                <LottiePlayer type="sleeping-cat" className="h-full w-full" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl sm:text-2xl font-extrabold font-comfortaa text-stone-900">
                  В вашей корзине пусто!
                </h2>
                <p className="text-sm text-stone-500 font-inter leading-relaxed">
                  Похоже, вы еще не баловали своих питомцев... Пора положить им сочной крольчатины или новые игрушки!
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa text-sm rounded-full shadow-md"
                >
                  Вернуться за покупками
                </Link>
              </div>
            </motion.div>
          ) : (

            <motion.div
              key="normal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
            >
              <CartList
                cart={cart}
                checkoutType={checkoutType}
                itemsSubtotal={itemsSubtotal}
                pickupAddress={pickupAddress}
              />

              <div className="lg:col-span-4 flex flex-col gap-6">
                <OrderSummary
                  cart={cart}
                  checkoutType={checkoutType}
                  itemsSubtotal={itemsSubtotal}
                  totalSavings={totalSavings}
                  deliveryCost={deliveryCost}
                  promoDiscount={promoDiscount}
                  promoError={promoError}
                  promoSuccess={promoSuccess}
                  grandTotal={grandTotal}
                />

                {checkoutType === 'delivery' && (
                  <DeliveryTermsBlock />
                )}

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}
