import { createContext, useContext } from 'react';
import type { ProductRatingsByProductId } from './productRatings';

export interface RatingsDataValue {
  productRatings: ProductRatingsByProductId;
  /** Гидрация из localStorage ещё не завершилась. */
  isHydrated: boolean;
}

/** Стабильные колбэки: отправка оценки не пересоздаёт контекст действий. */
export interface RatingsActionsValue {
  submitProductRating: (productId: string, rating: number) => void;
}

export type RatingsContextValue = RatingsDataValue & RatingsActionsValue;

export const RatingsDataContext = createContext<RatingsDataValue | undefined>(undefined);
export const RatingsActionsContext = createContext<RatingsActionsValue | undefined>(undefined);

export function useRatingsData(): RatingsDataValue {
  const ctx = useContext(RatingsDataContext);
  if (ctx === undefined) {
    throw new Error('useRatingsData must be used within a RatingProvider');
  }
  return ctx;
}

export function useRatingsActions(): RatingsActionsValue {
  const ctx = useContext(RatingsActionsContext);
  if (ctx === undefined) {
    throw new Error('useRatingsActions must be used within a RatingProvider');
  }
  return ctx;
}

export function useRatings(): RatingsContextValue {
  return { ...useRatingsData(), ...useRatingsActions() };
}
