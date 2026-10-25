import React from 'react';
import CatalogPage from './[...slug]/CatalogPage';

export default function CatalogIndexPage() {
  return <CatalogPage params={Promise.resolve({ slug: [] })} />;
}
