import { describe, it, expect } from 'vitest';
import {
  applyProductRating,
  resolveProductRating,
  parseStoredProductRatings,
} from '../productRatings';
import type { ProductRatingsByProductId } from '../productRatings';

describe('applyProductRating', () => {
  const base = { rating: 4.0, reviews: 10 };

  it('adds a new review and recomputes the average', () => {
    const next = applyProductRating({}, 'p1', 5, base);
    expect(next.p1).toEqual({ rating: 4.1, reviews: 11, userRating: 5 });
  });

  it('replaces the user rating without growing the review count', () => {
    const afterFirst = applyProductRating({}, 'p1', 5, base);
    const next = applyProductRating(afterFirst, 'p1', 3, base);
    expect(next.p1.reviews).toBe(11);
    expect(next.p1.userRating).toBe(3);
    expect(next.p1.rating).toBe(3.9);
  });

  it('rounds the resulting average to one decimal place', () => {
    const next = applyProductRating({}, 'p1', 2, { rating: 4.67, reviews: 3 });
    expect(next.p1.rating).toBe(4);
  });

  it('handles product with no reviews yet', () => {
    const next = applyProductRating({}, 'p1', 5, { rating: 5.0, reviews: 0 });
    expect(next.p1).toEqual({ rating: 5, reviews: 1, userRating: 5 });
  });

  it('does not mutate the previous map', () => {
    const prev: ProductRatingsByProductId = {};
    const next = applyProductRating(prev, 'p1', 4, base);
    expect(prev).toEqual({});
    expect(next).not.toBe(prev);
  });
});

describe('resolveProductRating', () => {
  const product = { id: 'p1', rating: 4.5, reviews: 20 };

  it('falls back to the product values when not rated', () => {
    expect(resolveProductRating({}, product)).toEqual({
      rating: 4.5,
      reviews: 20,
      userRating: undefined,
    });
  });

  it('prefers stored rating when present', () => {
    const stored: ProductRatingsByProductId = {
      p1: { rating: 4.6, reviews: 21, userRating: 5 },
    };
    expect(resolveProductRating(stored, product)).toEqual({
      rating: 4.6,
      reviews: 21,
      userRating: 5,
    });
  });
});

describe('parseStoredProductRatings', () => {
  it('returns null for missing, invalid or non-object payloads', () => {
    expect(parseStoredProductRatings(null)).toBeNull();
    expect(parseStoredProductRatings('')).toBeNull();
    expect(parseStoredProductRatings('{broken')).toBeNull();
    expect(parseStoredProductRatings('[1,2]')).toBeNull();
    expect(parseStoredProductRatings('"str"')).toBeNull();
  });

  it('keeps only structurally valid entries', () => {
    const raw = JSON.stringify({
      ok: { rating: 4.2, reviews: 3, userRating: 5 },
      partial: { rating: 4 },
      numeric: 7,
    });
    expect(parseStoredProductRatings(raw)).toEqual({
      ok: { rating: 4.2, reviews: 3, userRating: 5 },
    });
  });
});
