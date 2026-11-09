import type { Product } from '../model/types';
import { MOCK_PRODUCTS } from '../model/mock';

/**
 * TODO(API): заменить на реальные запросы (см. shared/api/useFetch), например
 * GET /api/products и GET /api/products/:id. Форму ответа (`Product` с полями
 * `description` и `specifications`) моки уже сохраняют — серверные данные
 * подставятся без правок компонентов.
 */
export function getAllProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function getProductById(id: string): Product | null {
  return MOCK_PRODUCTS.find((product) => product.id === id) ?? null;
}
