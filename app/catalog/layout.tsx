import React from 'react';
import HeroCarouselProvider from './_components/HeroCarouselProvider';

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <HeroCarouselProvider>{children}</HeroCarouselProvider>;
}
