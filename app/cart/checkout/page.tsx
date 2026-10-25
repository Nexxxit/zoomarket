'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { INITIAL_CART_ITEMS, DEMO_CHECKOUT_TYPE, DEMO_PICKUP_ADDRESS } from '@/entities/cart';
import type { CartItem, } from '@/entities/cart';
import type { UserProfile } from '@/entities/user';
import CheckoutForm from './_components/CheckoutForm';
import OrderSuccess from './_components/OrderSuccess';

export default function CheckoutPage() {
  const cart = INITIAL_CART_ITEMS;
  const checkoutType = DEMO_CHECKOUT_TYPE;
  const pickupAddress = DEMO_PICKUP_ADDRESS;
  const user = null as UserProfile | null;

  const orderPlaced = false;

  const name = user?.name || '';
  const phone = user?.phone || '';
  const email = user?.email || '';
  const comment = '';

  const street = user?.address || '';
  const house = user?.address ? '—' : '';
  const entrance = '';
  const flat = '';

  const purchasedItems: CartItem[] = [];
  const orderId = '';
  const orderTime = '';
  const orderTotal = 0;

  const itemsSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCost = checkoutType === 'delivery' ? (itemsSubtotal >= 1500 ? 0 : 290) : 0;
  const grandTotal = itemsSubtotal + deliveryCost;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">

        <AnimatePresence mode="wait">
          {!orderPlaced ? (

            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >

              <div>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-500 font-comfortaa transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Назад в корзину</span>
                </Link>
              </div>

              <div className="border-b border-stone-100 pb-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-comfortaa tracking-tight">
                  Оформление заказа
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 font-inter mt-1">
                  Пожалуйста, заполните необходимые поля для оформления доставки или самовывоза.
                </p>
              </div>

              <CheckoutForm
                cart={cart}
                checkoutType={checkoutType}
                pickupAddress={pickupAddress}
                itemsSubtotal={itemsSubtotal}
                deliveryCost={deliveryCost}
                grandTotal={grandTotal}
                user={user}
              />
            </motion.div>
          ) : (

            <OrderSuccess
              checkoutType={checkoutType}
              pickupAddress={pickupAddress}
              name={name}
              phone={phone}
              email={email}
              street={street}
              house={house}
              entrance={entrance}
              flat={flat}
              comment={comment}
              orderId={orderId}
              orderTime={orderTime}
              orderTotal={orderTotal}
              purchasedItems={purchasedItems}
            />
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}
