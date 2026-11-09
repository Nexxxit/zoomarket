import type { Product } from './types';

/**
 * Фасовка по умолчанию: средний размер (третий), иначе первый,
 * иначе undefined (товар без фасовки). Единственный источник правила —
 * использовать везде при вычислении ключа строки корзины.
 */
export function getDefaultProductSize(product: Pick<Product, 'sizes'>): string | undefined {
  return product.sizes?.[2] ?? product.sizes?.[0];
}
