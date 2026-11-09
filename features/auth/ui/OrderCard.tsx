'use client';

import type { OrderStatus, OrderSummary } from '@/entities/order';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/entities/order';
import { pluralize } from '@/shared/lib/format';

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  processing: 'bg-amber-100 text-amber-700',
  in_transit: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  completed: 'bg-stone-150 text-stone-600',
  cancelled: 'bg-red-100 text-red-700',
};

interface OrderCardProps {
  order: OrderSummary;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="bg-white border border-stone-100 p-3 rounded-xl flex items-center justify-between text-xs">
      <div className="space-y-1">
        <p className="font-bold text-stone-800">Заказ № {order.number}</p>
        <p className="text-[10px] text-stone-500">
          {order.itemsCount} {pluralize(order.itemsCount, ['товар', 'товара', 'товаров'])} •{' '}
          {PAYMENT_METHOD_LABELS[order.paymentMethod]}
        </p>
      </div>
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_BADGE_CLASSES[order.status]}`}
      >
        {ORDER_STATUS_LABELS[order.status]}
      </span>
    </div>
  );
}
