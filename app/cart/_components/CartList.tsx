'use client';

import React from 'react';
import type { CartItem, CheckoutType } from '@/entities/cart';
import { useCart } from '@/features/cart';
import CartItemRow from './CartItemRow';
import ShippingNotice from './ShippingNotice';

interface CartListProps {
  cart: CartItem[];
  checkoutType: CheckoutType;
  itemsSubtotal: number;
  pickupAddress: string;
}

export default function CartList({ cart, checkoutType, itemsSubtotal }: CartListProps) {
  const { updateQty, removeFromCart } = useCart();

  return (
    <div className="lg:col-span-8 bg-white p-6 border border-stone-100 rounded-3xl shadow-xs space-y-6">
      <div className="divide-y divide-stone-100">
        {cart.map((item) => (
          <CartItemRow
            key={`${item.id}-${item.size}`}
            item={item}
            onDecrease={() => updateQty(item.id, -1, item.size)}
            onIncrease={() => updateQty(item.id, 1, item.size)}
            onRemove={() => removeFromCart(item.id, item.size)}
          />
        ))}
      </div>

      <ShippingNotice
        checkoutType={checkoutType}
        itemsSubtotal={itemsSubtotal}
      />
    </div>
  );
}
