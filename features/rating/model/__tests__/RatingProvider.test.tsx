import { describe, it, expect, beforeEach } from 'vitest';
import { render, act, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { RatingProvider } from '../RatingProvider';
import { useRatingsData, useRatingsActions } from '../ratingContext';
import { getAllProducts } from '@/entities/product';

interface RatingsApi {
  productRatings: ReturnType<typeof useRatingsData>['productRatings'];
  submit: (id: string, rating: number) => void;
}

let latest: RatingsApi | null = null;

function Probe() {
  const data = useRatingsData();
  const actions = useRatingsActions();
  React.useEffect(() => {
    latest = { productRatings: data.productRatings, submit: actions.submitProductRating };
  });
  return <span data-testid="probe">{Object.keys(data.productRatings).length}</span>;
}

function renderRatings(): RatingsApi {
  render(
    <RatingProvider>
      <Probe />
    </RatingProvider>,
  );
  return latest!;
}

function submit(id: string, rating: number) {
  act(() => {
    latest!.submit(id, rating);
  });
}

describe('RatingProvider optimistic submit', () => {
  beforeEach(() => {
    localStorage.clear();
    latest = null;
  });

  it('applies the user rating synchronously (optimistic)', () => {
    const api = renderRatings();
    const product = getAllProducts()[0];

    submit(product.id, 4);

    // До разрешения ленивого импорта каталога оценка уже видна в store.
    expect(latest!.productRatings[product.id]?.userRating).toBe(4);
    void api;
  });

  it('recomputes the aggregate from the true catalog base once loaded', async () => {
    renderRatings();
    const product = getAllProducts()[0];

    submit(product.id, 1);

    await waitFor(() => {
      const entry = latest!.productRatings[product.id];
      // Откат optimistic (base 5.0/0) и пересчёт от реального rating/reviews:
      // reviews = product.reviews + 1 — больше «единички» оптимистичного пути.
      expect(entry.reviews).toBe(product.reviews + 1);
      expect(entry.rating).toBeLessThanOrEqual(product.rating);
      expect(entry.userRating).toBe(1);
    });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('aibolit_product_ratings') ?? '{}');
      expect(stored[product.id]?.userRating).toBe(1);
      expect(stored[product.id]?.reviews).toBe(product.reviews + 1);
    });
  });

  it('submit action identity is stable across rating changes', async () => {
    renderRatings();
    const first = latest!.submit;

    submit('p-x', 5);
    await waitFor(() => {
      expect(latest!.productRatings['p-x']).toBeDefined();
    });

    expect(latest!.submit).toBe(first);
    expect(screen.getByTestId('probe')).toBeInTheDocument();
  });
});
