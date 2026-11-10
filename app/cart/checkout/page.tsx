'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import {
  selectSubtotal,
  selectDeliveryCost,
  selectPromoDiscount,
  selectGrandTotal,
} from '@/entities/cart';
import type { CartItem } from '@/entities/cart';
import type { UserAddress } from '@/entities/user';
import { useCart } from '@/features/cart';
import { useAuth } from '@/features/auth';
import { OrderForm } from '@/features/order-form';
import type { OrderFormSubmission } from '@/features/order-form';
import OrderSuccess from './_components/OrderSuccess';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, checkoutType, pickupAddress, setPickupAddress, clearCart, clearPromo, promoCode } = useCart();
  const { user, updateAddress } = useAuth();

  const [submittedOrder, setSubmittedOrder] = React.useState<OrderFormSubmission | null>(null);
  const [purchasedItems, setPurchasedItems] = React.useState<CartItem[]>([]);
  const [orderId, setOrderId] = React.useState('');
  const [orderTime, setOrderTime] = React.useState('');
  const [orderTotal, setOrderTotal] = React.useState(0);
  const [addressSaveError, setAddressSaveError] = React.useState<string | null>(null);

  const orderPlaced = submittedOrder !== null;

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      router.push('/cart');
    }
  }, [cart, orderPlaced, router]);

  const itemsSubtotal = selectSubtotal(cart);
  const deliveryCost = selectDeliveryCost(itemsSubtotal, checkoutType);
  const promoDiscount = selectPromoDiscount(itemsSubtotal, promoCode);
  const grandTotal = selectGrandTotal(itemsSubtotal, deliveryCost, promoDiscount);

  if (cart.length === 0 && !orderPlaced) {
    return null;
  }

  const handlePlaceOrder = (values: OrderFormSubmission) => {
    setPurchasedItems([...cart]);
    setOrderTotal(grandTotal);

    const randomId = 'AB-' + Math.floor(100000 + Math.random() * 90000);
    setOrderId(randomId);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setOrderTime(`${day}.${month}.${year} ${hours}:${minutes}`);

    if (user && checkoutType === 'delivery' && values.street.trim() && values.house.trim()) {
      const street = values.street.trim();
      const house = values.house.trim();
      const flat = values.flat.trim() || undefined;
      const entrance = values.entrance.trim() || undefined;
      const address: UserAddress = { street, house, flat, entrance };
      const sameAsProfile =
        user.address?.street === street &&
        user.address?.house === house &&
        user.address?.flat === flat &&
        user.address?.entrance === entrance;
      if (!sameAsProfile) {
        void updateAddress(address).then((saved) => {
          if (!saved) {
            setAddressSaveError('Не удалось обновить адрес в профиле.');
          }
        });
      }
    }

    clearCart();
    clearPromo();
    setSubmittedOrder(values);
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grow">

      {addressSaveError && (
        <div
          role="alert"
          className="mb-4 flex items-start justify-between gap-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-inter rounded-xl px-4 py-3"
        >
          <span>{addressSaveError}</span>
          <button
            type="button"
            onClick={() => setAddressSaveError(null)}
            aria-label="Скрыть предупреждение"
            className="font-bold text-amber-600 hover:text-amber-800 cursor-pointer bg-transparent border-0"
          >
            ✕
          </button>
        </div>
      )}

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
              </div>

              <OrderForm
                key={user?.id ?? 'anonymous'}
                checkoutType={checkoutType}
                pickupAddress={pickupAddress}
                onSelectPickupAddress={setPickupAddress}
                user={user}
                summary={{ cart, itemsSubtotal, deliveryCost, promoDiscount, grandTotal }}
                onSubmit={handlePlaceOrder}
              />
            </motion.div>
          ) : (

            <OrderSuccess
              key="success"
              checkoutType={checkoutType}
              {...submittedOrder}
              orderId={orderId}
              orderTime={orderTime}
              orderTotal={orderTotal}
              purchasedItems={purchasedItems}
            />
          )}
        </AnimatePresence>

    </main>
  );
}
