export type OrderStatus = 'processing' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';

export type PaymentMethod = 'courier' | 'pickup' | 'card';

/**
 * Краткая карточка заказа — ответ `GET /api/user/orders` для личного кабинета.
 */
export interface OrderSummary {
  id: string;
  userId: string;
  /** Номер заказа для отображения (например, «582914») */
  number: string;
  /** ISO-дата создания */
  createdAt: string;
  itemsCount: number;
  /** Сумма заказа в рублях */
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
}
