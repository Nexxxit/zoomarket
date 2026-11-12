import type { Product } from './types';
import { getAllProducts } from '../api';

/**
 * Индекс «id → товар»: O(1) поиск вместо `MOCK_PRODUCTS.find` на каждую
 * строку корзины/рекомендацию. Источник — api-слой (фаза 5 переведёт его на
 * Promise без изменения consumers).
 */
function buildProductIndex(): ReadonlyMap<string, Product> {
  return new Map(getAllProducts().map((product) => [product.id, product]));
}

let productByIdIndex: ReadonlyMap<string, Product> | null = null;

export function selectProductById(id: string): Product | undefined {
  if (productByIdIndex === null) {
    productByIdIndex = buildProductIndex();
  }
  return productByIdIndex.get(id);
}
