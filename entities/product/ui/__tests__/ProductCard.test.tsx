import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';
import { CartProvider } from '@/features/cart';
import { FavoritesProvider } from '@/features/favorites';
import { formatPrice } from '@/shared/lib/format';
import type { Product } from '@/entities/product';

vi.mock('next/image', async () => {
  const { createElement } = await vi.importActual<typeof import('react')>('react');
  return {
    default: (props: Record<string, unknown>) => createElement('img', props),
  };
});

const product: Product = {
  id: 'test-1',
  name: 'Ownat Adult Selecta',
  category: 'Корма',
  price: 1234,
  oldPrice: 1999,
  rating: 4.8,
  reviews: 15,
  onSale: true,
  salePct: 20,
  badge: 'Хит',
  type: 'food',
  animal: 'cat',
  brand: 'Ownat',
  sizes: ['300 г', '1,5 кг', '4 кг'],
  subcategoryId: 'cat-food',
  subSection: 'Сухой корм',
  inStock: true,
};

function renderCard(p: Product) {
  return render(
    <FavoritesProvider>
      <CartProvider>
        <ProductCard product={p} />
      </CartProvider>
    </FavoritesProvider>,
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders prices via formatPrice (no raw "{n} ₽")', () => {
    const { baseElement } = renderCard(product);
    expect(baseElement.textContent).toContain(formatPrice(1234));
    expect(baseElement.textContent).toContain(formatPrice(1999));
    expect(baseElement.textContent).not.toContain('1234 ₽');
  });

  it('shows sale percent and badge', () => {
    renderCard(product);
    expect(screen.getByText('–20%')).toBeInTheDocument();
    expect(screen.getByText('Хит')).toBeInTheDocument();
  });

  it('marks the selected size with aria-pressed', () => {
    renderCard(product);
    expect(screen.getByRole('button', { name: '4 кг' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '300 г' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('opens cart toast when adding to cart', async () => {
    const user = userEvent.setup();
    renderCard(product);
    await user.click(screen.getByRole('button', { name: /Добавить .* в корзину/ }));
    expect(await screen.findByText('Товар добавлен')).toBeInTheDocument();
    expect(baseLiveText()).toContain(product.name);
  });

  it('keeps the same toast element when the lazy recommendation arrives', async () => {
    const user = userEvent.setup();
    renderCard(product);
    await user.click(screen.getByRole('button', { name: /Добавить .* в корзину/ }));
    const header = await screen.findByText('Товар добавлен');
    const toast = header.closest('[role="region"]');
    expect(toast).not.toBeNull();

    // Рекомендация подгружается динамическим импортом: появление блока
    // «С этим часто покупают» не должно перемонтировать тост (exit+enter).
    await screen.findByText('С этим часто покупают:');
    expect(header.closest('[role="region"]')).toBe(toast);
  });

  it('renders disabled state when out of stock', () => {
    renderCard({ ...product, inStock: false });
    expect(screen.getByRole('button', { name: 'Нет в наличии' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /Добавить .* в корзину/ })).toBeNull();
  });

  it('links to detail page with encoded from query when backTo is provided', () => {
    const { container } = render(
      <FavoritesProvider>
        <CartProvider>
          <ProductCard product={product} backTo="cat/cat-food" />
        </CartProvider>
      </FavoritesProvider>,
    );
    const href = container.querySelector('a')?.getAttribute('href') ?? '';
    expect(href).toContain('/catalog/cat/cat-food/%D0%A1%D1%83%D1%85%D0%BE%D0%B9%20%D0%BA%D0%BE%D1%80%D0%BC/test-1?from=');
    expect(decodeURIComponent(href.split('?from=')[1])).toBe('cat/cat-food');
  });

  it('links without from query when backTo is omitted', () => {
    const { container } = renderCard(product);
    expect(container.querySelector('a')?.getAttribute('href')).not.toContain('?from=');
  });
});

function baseLiveText(): string {
  const live = document.querySelector('[aria-live="polite"]');
  return live?.textContent ?? '';
}
