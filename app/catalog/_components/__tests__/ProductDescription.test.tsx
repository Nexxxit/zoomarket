import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductDescription from '../ProductDescription';
import { getAllProducts, getProductById } from '@/entities/product';
import type { Product } from '@/entities/product';

const MOCK_PRODUCTS = getAllProducts();

const baseProduct: Product = {
  id: 'x-1',
  name: 'Тестовый корм',
  category: 'Корма',
  price: 100,
  rating: 4.5,
  reviews: 2,
  onSale: false,
  type: 'food',
  animal: 'cat',
};

describe('ProductDescription', () => {
  it('renders description paragraphs and specifications from product data', () => {
    const product: Product = {
      ...baseProduct,
      description: ['Первый абзац.', 'Второй абзац.'],
      specifications: [
        { label: 'Тип корма', value: 'Полнорационный' },
        { label: 'Класс товара', value: 'Холистик' },
      ],
    };
    const { container } = render(<ProductDescription product={product} />);
    expect(screen.getByText('Первый абзац.')).toBeInTheDocument();
    expect(screen.getByText('Второй абзац.')).toBeInTheDocument();
    expect(screen.getByText('Тип корма')).toBeInTheDocument();
    expect(screen.getByText('Холистик')).toBeInTheDocument();
    expect(screen.queryByText('Животное')).toBeNull();
    expect(container.querySelectorAll('p')).toHaveLength(2);
  });

  it('renders nothing when server sent no description or specifications', () => {
    const { container } = render(<ProductDescription product={baseProduct} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('mocks already carry server-shaped description and specifications', () => {
    expect(MOCK_PRODUCTS.length).toBeGreaterThan(0);
    for (const product of MOCK_PRODUCTS) {
      expect(product.description?.length).toBeGreaterThan(0);
      expect(product.specifications?.length).toBeGreaterThan(0);
      for (const spec of product.specifications ?? []) {
        expect(spec.label).toBeTruthy();
        expect(spec.value).toBeTruthy();
      }
    }
    expect(getProductById('1')?.specifications?.[1]).toEqual({
      label: 'Животное',
      value: 'Кошки',
    });
  });
});
