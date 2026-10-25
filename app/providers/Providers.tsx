'use client';

import React from 'react';
import { CartToastProvider } from '@/features/cart';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartToastProvider>{children}</CartToastProvider>;
}
