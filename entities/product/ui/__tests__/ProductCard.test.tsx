import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';
import { CartToastProvider } from '@/features/cart';
import { formatPrice } from '@/shared/lib/format';
import type { Product } from '@/entities/product';

vi.mock('next/image', async () => {
  const { createElement } = await vi.importActual<typeof import('react')>('react');
  return {
    default: (props: Record<string, unknown>) => createElement('img', props),
  };
});

vi.mock('next/navigation', () => ({
  usePathname: () => '/catalog/cat/cat-food/all',
}));

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
    <CartToastProvider>
      <ProductCard product={p} />
    </CartToastProvider>,
  );
}

describe('ProductCard', () => {
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

  it('renders disabled state when out of stock', () => {
    renderCard({ ...product, inStock: false });
    expect(screen.getByRole('button', { name: 'Нет в наличии' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /Добавить .* в корзину/ })).toBeNull();
  });
});

function baseLiveText(): string {
  const live = document.querySelector('[aria-live="polite"]');
  return live?.textContent ?? '';
}
