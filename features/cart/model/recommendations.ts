import type { Product } from '@/entities/product';

/**
 * Каталог подгружается динамически: этот модуль ссылается на layout-стор
 * (CartProvider), и статический импорт моков протёк бы в initial-бандл
 * каждой страницы. TODO(API): фаза 5 переведёт источник на Promise.
 */
async function loadPool(): Promise<Product[]> {
  try {
    const { getAllProducts } = await import('@/entities/product');
    return getAllProducts();
  } catch (e) {
    // Чанк каталога мог не догрузиться (офлайн/деплой) — тост живёт без блока
    // «с этим часто покупают», без unhandled rejection.
    console.error('Failed to load recommendations pool', e);
    return [];
  }
}

/** Рекомендация к тосту: null до догрузки пула — UI просто не покажет блок. */
export async function findRecommendation(
  product: Product,
  excludeIds: string[] = [],
  cartProductIds: string[] = [],
): Promise<Product | null> {
  const pool = await loadPool();
  const excluded = new Set([product.id, ...excludeIds, ...cartProductIds]);
  const candidates = pool.filter(
    p => p.animal === product.animal && !excluded.has(p.id) && p.inStock !== false,
  );

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function getRecommendationScore(product: Product): number {
  let score = product.rating * 10;
  if (product.badge === 'Хит' || product.badge === 'Рекомендовано') score += 50;
  if (product.onSale) score += 10;
  return score;
}

/** Рекомендации для блока корзины (синхронный пул приходит от consumers). */
export function selectCartRecommendations(
  pool: Product[],
  cartIds: string[],
  cartAnimals: string[],
  limit = 3,
): Product[] {
  const cartIdSet = new Set(cartIds);
  const available = pool.filter(
    product => !cartIdSet.has(product.id) && product.inStock !== false,
  );

  const related = available.filter(
    product =>
      cartAnimals.length === 0 ||
      cartAnimals.includes(product.animal) ||
      product.animal === 'universal',
  );

  const candidates = related.length > 0 ? related : available;

  return [...candidates]
    .sort((a, b) => getRecommendationScore(b) - getRecommendationScore(a))
    .slice(0, limit);
}
