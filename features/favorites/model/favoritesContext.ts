import { createContext, useContext } from 'react';

export interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
