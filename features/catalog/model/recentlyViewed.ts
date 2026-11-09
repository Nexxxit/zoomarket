import type { Product } from '@/entities/product';

const RECENTLY_VIEWED_LIMIT = 8;

/**
 * Просмотренные товары: реальные id из history, при нехватке — добор
 * товарами того же животного, что и активный продукт.
 */
export function selectRecentlyViewed(
  products: Product[],
  viewedIds: string[],
  activeProduct: Product | null,
  limit: number = RECENTLY_VIEWED_LIMIT,
): Product[] {
  const viewed = products.filter(
    p => viewedIds.includes(p.id) && p.id !== activeProduct?.id,
  );
  if (viewed.length < limit && activeProduct) {
    const extra = products
      .filter(
        p =>
          p.animal === activeProduct.animal &&
          p.id !== activeProduct.id &&
          !viewed.some(v => v.id === p.id),
      )
      .slice(0, limit - viewed.length);
    return [...viewed, ...extra];
  }
  return viewed;
}
