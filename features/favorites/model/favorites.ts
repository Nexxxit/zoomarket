export function toggleFavoriteId(favorites: string[], productId: string): string[] {
  if (favorites.includes(productId)) {
    return favorites.filter(id => id !== productId);
  }
  return [...favorites, productId];
}

export function parseStoredFavorites(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return null;
  }
}
