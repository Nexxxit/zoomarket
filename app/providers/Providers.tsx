'use client';

import React from 'react';
import { FavoritesProvider } from '@/features/favorites';
import { CartProvider } from '@/features/cart';
import { RatingProvider } from '@/features/rating';
import { AuthProvider } from '@/features/auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <RatingProvider>
          <CartProvider>{children}</CartProvider>
        </RatingProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
