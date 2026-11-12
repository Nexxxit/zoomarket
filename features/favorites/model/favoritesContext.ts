import { createContext, useContext } from 'react';

export interface FavoritesDataValue {
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  /** Гидрация из localStorage ещё не завершилась: лайки гейтятся этим флагом. */
  isHydrated: boolean;
}

/** Стабильные колбэки: смена списка избранного не пересоздаёт контекст действий. */
export interface FavoritesActionsValue {
  toggleFavorite: (productId: string) => void;
}

export type FavoritesContextValue = FavoritesDataValue & FavoritesActionsValue;

export const FavoritesDataContext = createContext<FavoritesDataValue | undefined>(undefined);
export const FavoritesActionsContext = createContext<FavoritesActionsValue | undefined>(undefined);

export function useFavoritesData(): FavoritesDataValue {
  const ctx = useContext(FavoritesDataContext);
  if (ctx === undefined) {
    throw new Error('useFavoritesData must be used within a FavoritesProvider');
  }
  return ctx;
}

export function useFavoritesActions(): FavoritesActionsValue {
  const ctx = useContext(FavoritesActionsContext);
  if (ctx === undefined) {
    throw new Error('useFavoritesActions must be used within a FavoritesProvider');
  }
  return ctx;
}

export function useFavorites(): FavoritesContextValue {
  return { ...useFavoritesData(), ...useFavoritesActions() };
}
