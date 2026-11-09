import { MOCK_PRODUCTS } from '@/entities/product';
import type { Product } from '@/entities/product';

export function findRecommendation(
  product: Product,
  excludeIds: string[] = [],
  cartProductIds: string[] = [],
): Product | null {
  const excluded = new Set([product.id, ...excludeIds, ...cartProductIds]);
  const candidates = MOCK_PRODUCTS.filter(
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

export function selectCartRecommendations(
  cartIds: string[],
  cartAnimals: string[],
  limit = 3,
): Product[] {
  const available = MOCK_PRODUCTS.filter(
    product => !cartIds.includes(product.id) && product.inStock !== false,
  );

  const related = available.filter(
    product =>
      cartAnimals.length === 0 ||
      cartAnimals.includes(product.animal) ||
      product.animal === 'universal',
  );

  const pool = related.length > 0 ? related : available;

  return [...pool]
    .sort((a, b) => getRecommendationScore(b) - getRecommendationScore(a))
    .slice(0, limit);
}
