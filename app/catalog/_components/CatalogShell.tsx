'use client';

import React from 'react';
import HeroCarousel from './HeroCarousel';

interface CatalogShellProps {
  showHero?: boolean;
  children: React.ReactNode;
}

export default function CatalogShell({ showHero = true, children }: CatalogShellProps) {
  return (
    <div className="flex flex-col grow">
      {showHero && <HeroCarousel />}

      {children}
    </div>
  );
}
