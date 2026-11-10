export const FREE_SHIPPING_THRESHOLD = 1500;
export const DELIVERY_COST = 290;
export const LOYALTY_BONUS_PCT = 10;

/** Промокод → доля скидки от подитога. */
export const PROMO_CODES: Record<string, number> = {
  AIBOLIT10: 0.1,
  LOVEPETS: 0.15,
};

/**
 * Безопасная проверка промокода: Object.hasOwn игнорирует ключи прототипа
 * («constructor», «toString» и т.п.), на которых `code in PROMO_CODES`
 * давал бы ложный хит и NaN в расчёте скидки.
 */
export function getPromo(code: string): number | undefined {
  const value: unknown = Object.hasOwn(PROMO_CODES, code)
    ? PROMO_CODES[code]
    : undefined;
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
