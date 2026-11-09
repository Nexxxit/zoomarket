'use client';

import type { OrderSummary } from '@/entities/order';
import OrderCard from './OrderCard';
import OrderCardSkeleton from './OrderCardSkeleton';

interface OrderHistorySectionProps {
  orders: OrderSummary[] | null;
  loading: boolean;
}

export default function OrderHistorySection({ orders, loading }: OrderHistorySectionProps) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block pl-1">
        История заказов
      </span>

      {loading ? (
        <div className="space-y-2.5" role="status" aria-label="Загружаем историю заказов">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="bg-white border border-stone-100 p-4 rounded-xl text-center text-xs text-stone-400 font-inter italic">
          Заказов пока нет 🐾 — самое время порадовать питомца!
        </div>
      ) : (
        <div className="space-y-2.5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
