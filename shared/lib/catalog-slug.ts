export function decodeCatalogSlugSegment(segment: string): string {
  let result = segment;
  for (let i = 0; i < 5; i++) {
    try {
      const decoded = decodeURIComponent(result);
      if (decoded === result) break;
      result = decoded;
    } catch {
      break;
    }
  }
  return result;
}

export function encodeCatalogSlugSegment(segment: string): string {
  return encodeURIComponent(decodeCatalogSlugSegment(segment));
}

export function getAllCategoryPillLabel(categoryName: string): string {
  const lower = categoryName.trim().toLowerCase();
  const first = lower.split(/[\s,]/)[0] ?? lower;

  if (
    /(?:ы|и|ые|ие|ства)$/.test(first) ||
    first === 'корма' ||
    first === 'средства'
  ) {
    return `Все ${lower}`;
  }

  if (/[ая]$/.test(first) && !first.endsWith('мя')) {
    return `Вся ${lower}`;
  }

  if (/[ое]$/.test(first)) {
    return `Всё ${lower}`;
  }

  return `Весь ${lower}`;
}
