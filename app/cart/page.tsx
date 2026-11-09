'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import {
  selectCartCount,
  selectSubtotal,
  selectOldSubtotal,
  selectDeliveryCost,
  selectPromoDiscount,
  selectGrandTotal,
} from '@/entities/cart';
import type { Product } from '@/entities/product';
import { useCart } from '@/features/cart';
import { PROMO_CODES } from '@/shared/config/commerce';
import CartList from './_components/CartList';
import EmptyCart from './_components/EmptyCart';
import OrderSummary from './_components/OrderSummary';
import DeliveryTermsBlock from './_components/DeliveryTermsBlock';

export default function CartPage() {
  const {
    cart,
    checkoutType,
    setCheckoutType,
    pickupAddress,
    addToCart,
    promoCode,
    applyPromo,
    clearPromo,
  } = useCart();

  const [promoInput, setPromoInput] = React.useState('');
  const [promoError, setPromoError] = React.useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = React.useState<string | null>(null);

  const itemsCount = selectCartCount(cart);
  const itemsSubtotal = selectSubtotal(cart);
  const itemsOldSubtotal = selectOldSubtotal(cart);
  const totalSavings = itemsOldSubtotal - itemsSubtotal;
  const deliveryCost = selectDeliveryCost(itemsSubtotal, checkoutType);
  const promoDiscount = selectPromoDiscount(itemsSubtotal, promoCode);
  const grandTotal = selectGrandTotal(itemsSubtotal, deliveryCost, promoDiscount);

  const handleApplyPromo = () => {
    setPromoError(null);
    setPromoSuccess(null);
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Введите промокод');
      return;
    }
    if (code in PROMO_CODES) {
      applyPromo(code);
      setPromoSuccess('Промокод применен');
    } else {
      clearPromo();
      setPromoError('Неверный промокод');
    }
  };

  const handleAddRecommendation = (product: Product) => {
    addToCart(product, undefined, { silent: true });
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grow">

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
            ({itemsCount})
          </span>
        </h1>
      </section>

      <AnimatePresence mode="wait">

        {cart.length === 0 ? (
          <EmptyCart key="empty" />
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
                itemCount={itemsCount}
                checkoutType={checkoutType}
                onCheckoutTypeChange={setCheckoutType}
                itemsSubtotal={itemsSubtotal}
                totalSavings={totalSavings}
                deliveryCost={deliveryCost}
                promoDiscount={promoDiscount}
                promoError={promoError}
                promoSuccess={promoSuccess}
                grandTotal={grandTotal}
                promoInput={promoInput}
                onPromoInputChange={setPromoInput}
                onApplyPromo={handleApplyPromo}
                onAddRecommendation={handleAddRecommendation}
              />

              {checkoutType === 'delivery' && (
                <DeliveryTermsBlock />
              )}

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </main>
  );
}
