import React from 'react';
import CatalogPage from './CatalogPage';
import { CATALOG_STRUCTURE } from '@/entities/catalog';
import { MOCK_PRODUCTS } from '@/entities/product';

interface CatalogProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const paths: Array<{ slug: string[] }> = [];

  Object.keys(CATALOG_STRUCTURE).forEach((animal) => {
    paths.push({ slug: [animal] });
    const group = CATALOG_STRUCTURE[animal];
    if (group && group.subcategories) {
      group.subcategories.forEach((sub) => {
        paths.push({ slug: [animal, sub.id] });
        paths.push({ slug: [animal, sub.id, 'all'] });
        if (sub.subSections) {
          sub.subSections.forEach((sec) => {
            paths.push({ slug: [animal, sub.id, sec] });
          });
        }
      });
    }
  });

  paths.push({ slug: ['brands'] });
  const uniqueBrands = new Set<string>();
  MOCK_PRODUCTS.forEach((product) => {
    if (product.brand?.trim()) {
      uniqueBrands.add(product.brand.trim());
    }
  });
  uniqueBrands.forEach((brand) => {
    paths.push({ slug: ['brands', brand] });
  });

  MOCK_PRODUCTS.forEach((product) => {
    if (product.animal && product.subcategoryId) {
      const sec = product.subSection ? product.subSection : 'all';
      paths.push({
        slug: [
          product.animal,
          product.subcategoryId,
          sec,
          product.id
        ]
      });
    }
  });

  return paths;
}

export default function CatalogDynamicPage({ params }: CatalogProps) {
  return <CatalogPage params={params} />;
}
