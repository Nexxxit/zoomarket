'use client';

import React from 'react';
import { MotionConfig } from 'motion/react';
import { FavoritesProvider } from '@/features/favorites';
import { CartProvider } from '@/features/cart';
import { RatingProvider } from '@/features/rating';
import { AuthProvider } from '@/features/auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // reducedMotion="user": один оверрайд на весь motion-стек (LottiePlayer,
    // Loader, карусели) — системная настройка «меньше движения» уважается.
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <FavoritesProvider>
          <RatingProvider>
            <CartProvider>{children}</CartProvider>
          </RatingProvider>
        </FavoritesProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
