import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CatalogPage from './CatalogPage';
import CatalogSkeleton from '../_components/CatalogSkeleton';
import { CATALOG_STRUCTURE } from '@/entities/catalog';
import { MOCK_PRODUCTS, getProductById } from '@/entities/product';
import { parseCatalogSlug } from '@/features/catalog';

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

async function CatalogRoute({ params }: CatalogProps) {
  const { slug = [] } = await params;
  const state = parseCatalogSlug(slug);
  if (slug.length > 0 && !state.section) {
    notFound();
  }
  if (state.slugLength === 4 && state.productId && !getProductById(state.productId)) {
    notFound();
  }
  return <CatalogPage slug={slug} />;
}

/**
 * URL-данные (params) читаются внутри <Suspense>: иначе Next не может собрать
 * мгновенный App Shell для навигации (instant-shell-url-data, Next 16).
 */
export default function CatalogDynamicPage({ params }: CatalogProps) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogRoute params={params} />
    </Suspense>
  );
}
