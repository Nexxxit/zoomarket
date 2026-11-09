import { CATALOG_STRUCTURE } from '@/entities/catalog';
import { decodeCatalogSlugSegment } from '@/shared/lib';

const VALID_SECTIONS = new Set([...Object.keys(CATALOG_STRUCTURE), 'brands']);

/** Разбирает query-параметр `from` (сегменты пути каталога через '/') в список сегментов. */
export function parseBackSource(from: string | null): string[] | null {
  if (!from) return null;
  const segments = from
    .split('/')
    .filter(Boolean)
    .map(decodeCatalogSlugSegment);
  if (segments.length < 1 || segments.length > 3) return null;
  if (segments.some((s) => s === '.' || s === '..')) return null;
  const [section, subId, sec] = segments;
  if (!VALID_SECTIONS.has(section)) return null;
  if (section === 'brands') return segments;
  const group = CATALOG_STRUCTURE[section];
  if (!group) return null;
  if (subId !== undefined) {
    const sub = group.subcategories.find((s) => s.id === subId);
    if (!sub) return null;
    if (sec !== undefined && sec !== 'all' && !sub.subSections.includes(sec)) return null;
  }
  return segments;
}

/** Человекочитаемое имя уровня каталога для кнопки «Назад». */
export function getCatalogBackLabel(segments: string[]): string {
  const [section, subId, sec] = segments;
  if (section === 'brands') {
    return subId ? decodeCatalogSlugSegment(subId) : 'Бренды';
  }
  const group = CATALOG_STRUCTURE[section];
  if (!group) return 'Каталог';
  if (!subId) return group.name;
  const sub = group.subcategories.find((s) => s.id === subId);
  const subName = sub?.name ?? decodeCatalogSlugSegment(subId);
  if (!sec) return subName;
  return sec === 'all' ? subName : sec;
}
