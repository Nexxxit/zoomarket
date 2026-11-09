import type { OrderSummary } from './types';

/** Мок-ответ `GET /api/user/orders` (сортировка: новые сверху). */
export const MOCK_ORDERS: OrderSummary[] = [
  {
    id: 'o-583001',
    userId: 'u-demo-1',
    number: '583001',
    createdAt: '2026-11-02T18:40:00.000Z',
    itemsCount: 2,
    total: 1560,
    paymentMethod: 'card',
    status: 'in_transit',
  },
  {
    id: 'o-582914',
    userId: 'u-demo-1',
    number: '582914',
    createdAt: '2026-10-21T14:10:00.000Z',
    itemsCount: 3,
    total: 2450,
    paymentMethod: 'courier',
    status: 'delivered',
  },
  {
    id: 'o-581403',
    userId: 'u-demo-1',
    number: '581403',
    createdAt: '2026-09-30T09:25:00.000Z',
    itemsCount: 1,
    total: 890,
    paymentMethod: 'pickup',
    status: 'completed',
  },
];
