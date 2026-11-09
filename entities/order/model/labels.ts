import type { OrderStatus, PaymentMethod } from './types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  processing: 'В обработке ⏳',
  in_transit: 'В пути 🚚',
  delivered: 'Доставлен ✅',
  completed: 'Завершён 👍',
  cancelled: 'Отменён ❌',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  courier: 'Оплата курьеру',
  pickup: 'Самовывоз',
  card: 'Оплата картой',
};
