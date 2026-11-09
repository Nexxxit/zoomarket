import { createContext, useContext } from 'react';
import type { ProductRatingsByProductId } from './productRatings';

export interface RatingsContextValue {
  productRatings: ProductRatingsByProductId;
  submitProductRating: (productId: string, rating: number) => void;
}

export const RatingsContext = createContext<RatingsContextValue | undefined>(undefined);

export function useRatings(): RatingsContextValue {
  const context = useContext(RatingsContext);
  if (context === undefined) {
    throw new Error('useRatings must be used within a RatingProvider');
  }
  return context;
}
