export interface ProductRating {
  rating: number;
  reviews: number;
  userRating?: number;
}

export type ProductRatingsByProductId = Record<string, ProductRating>;

export function applyProductRating(
  prev: ProductRatingsByProductId,
  productId: string,
  userRating: number,
  base: { rating: number; reviews: number },
): ProductRatingsByProductId {
  const existing = prev[productId];
  const currentRating = existing ? existing.rating : base.rating;
  const currentReviews = existing ? existing.reviews : base.reviews;

  let nextReviews = currentReviews;
  let nextRating = currentRating;

  if (existing && existing.userRating !== undefined) {
    const prevUserRating = existing.userRating || 0;
    nextRating = Math.round(((currentRating * currentReviews - prevUserRating + userRating) / currentReviews) * 10) / 10;
  } else {
    nextReviews = currentReviews + 1;
    nextRating = Math.round(((currentRating * currentReviews + userRating) / nextReviews) * 10) / 10;
  }

  return {
    ...prev,
    [productId]: {
      rating: nextRating,
      reviews: nextReviews,
      userRating,
    },
  };
}

export function resolveProductRating(
  stored: ProductRatingsByProductId,
  product: { id: string; rating: number; reviews: number },
): ProductRating {
  const existing = stored[product.id];
  return {
    rating: existing?.rating ?? product.rating,
    reviews: existing?.reviews ?? product.reviews,
    userRating: existing?.userRating,
  };
}

export function parseStoredProductRatings(raw: string | null): ProductRatingsByProductId | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const result: ProductRatingsByProductId = {};
    Object.entries(parsed as Record<string, unknown>).forEach(([id, value]) => {
      if (!value || typeof value !== 'object') return;
      const entry = value as Record<string, unknown>;
      if (typeof entry.rating !== 'number' || typeof entry.reviews !== 'number') return;
      result[id] = {
        rating: entry.rating,
        reviews: entry.reviews,
        userRating: typeof entry.userRating === 'number' ? entry.userRating : undefined,
      };
    });
    return result;
  } catch {
    return null;
  }
}
