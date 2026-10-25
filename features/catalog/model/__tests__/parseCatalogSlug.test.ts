import { describe, it, expect } from 'vitest';
import { parseCatalogSlug } from '../parseCatalogSlug';

describe('parseCatalogSlug', () => {
  it('parses empty slug to cat-default scope', () => {
    const state = parseCatalogSlug([]);
    expect(state).toMatchObject({
      section: null,
      animal: 'cat',
      isBrands: false,
      isVet: false,
      activeBrandName: null,
      subcategoryId: null,
      subSection: 'all',
      productId: null,
      slugLength: 0,
    });
  });

  it('validates animal section strictly', () => {
    expect(parseCatalogSlug(['dog']).section).toBe('dog');
    expect(parseCatalogSlug(['zzz']).section).toBeNull();
    expect(parseCatalogSlug(['zzz']).animal).toBe('zzz');
  });

  it('parses full product slug (4 levels)', () => {
    const state = parseCatalogSlug(['cat', 'cat-food', 'Сухой корм', '1']);
    expect(state.section).toBe('cat');
    expect(state.subcategoryId).toBe('cat-food');
    expect(state.subSection).toBe('Сухой корм');
    expect(state.productId).toBe('1');
    expect(state.slugLength).toBe(4);
  });

  it('decodes percent-encoded subSection', () => {
    const encoded = encodeURIComponent('Лечебный и диетический корм');
    expect(parseCatalogSlug(['cat', 'cat-food', encoded, '5']).subSection)
      .toBe('Лечебный и диетический корм');
  });

  it('treats 3-level slug as grid view without productId', () => {
    const state = parseCatalogSlug(['cat', 'cat-food', 'all']);
    expect(state.productId).toBeNull();
    expect(state.subSection).toBe('all');
  });

  it('parses brands section without leaking subcategoryId', () => {
    const encodedBrand = encodeURIComponent('Grandorf');
    const state = parseCatalogSlug(['brands', encodedBrand]);
    expect(state.isBrands).toBe(true);
    expect(state.activeBrandName).toBe('Grandorf');
    expect(state.subcategoryId).toBeNull();
    expect(state.subSection).toBe('all');
  });

  it('marks vet section', () => {
    const state = parseCatalogSlug(['vet', 'vet-flea', 'Спреи']);
    expect(state.isVet).toBe(true);
    expect(state.section).toBe('vet');
    expect(state.subSection).toBe('Спреи');
  });
});
