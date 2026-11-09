import { CATALOG_STRUCTURE } from '@/entities/catalog';
import type { BreadcrumbItem } from '@/shared/ui';
import type { CatalogSlugState } from './types';

export interface CatalogBreadcrumbsInput {
  slug: string[];
  state: CatalogSlugState;
  subcategoryName?: string | null;
  productName?: string | null;
}

/**
 * Уровень крошек = глубина slug: brands → [Бренды, бренд];
 * иначе [категория, подкатегория, раздел (кроме 'all'), товар].
 * Последний item всегда активен; кликабельны все предыдущие (segments = префикс slug).
 */
export function buildCatalogBreadcrumbs({
  slug,
  state,
  subcategoryName,
  productName,
}: CatalogBreadcrumbsInput): BreadcrumbItem[] {
  if (slug.length === 0) return [];

  if (state.isBrands) {
    return [
      { label: 'Бренды', segments: slug.slice(0, 1) },
      ...(state.activeBrandName
        ? [{ label: state.activeBrandName, segments: slug.slice(0, 2) }]
        : []),
    ];
  }

  const showSubSection = slug.length >= 3 && state.subSection !== 'all';

  return [
    {
      label: CATALOG_STRUCTURE[slug[0]]?.name || slug[0],
      segments: slug.slice(0, 1),
      className: 'capitalize',
    },
    ...(slug.length >= 2
      ? [{ label: subcategoryName || slug[1], segments: slug.slice(0, 2) }]
      : []),
    ...(showSubSection
      ? [{ label: state.subSection, segments: slug.slice(0, 3) }]
      : []),
    ...(slug.length >= 4
      ? [{ label: productName || slug[3], className: 'max-w-35 truncate' }]
      : []),
  ];
}
