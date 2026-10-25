import { decodeCatalogSlugSegment } from '@/shared/lib/catalog-slug';
import type { CatalogSection, CatalogSlugState } from './types';

const CATALOG_SECTIONS: readonly CatalogSection[] = [
  'cat', 'dog', 'bird', 'rodent', 'fish', 'vet', 'brands',
];

export function parseCatalogSlug(slug: string[]): CatalogSlugState {
  const rawSection = slug[0] ?? '';
  const section: CatalogSection | null =
    (CATALOG_SECTIONS as readonly string[]).includes(rawSection)
      ? (rawSection as CatalogSection)
      : null;

  const isBrands = section === 'brands';
  const isVet = section === 'vet';

  return {
    section,
    animal: rawSection || 'cat',
    isBrands,
    isVet,
    activeBrandName: isBrands && slug[1] ? decodeCatalogSlugSegment(slug[1]) : null,
    subcategoryId: isBrands ? null : (slug[1] || null),
    subSection: isBrands ? 'all' : (slug[2] ? decodeCatalogSlugSegment(slug[2]) : 'all'),
    productId: slug.length >= 4 ? slug[3] : null,
    slugLength: slug.length,
  };
}
