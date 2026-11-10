'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { parseBackSource, getCatalogBackLabel } from '@/features/catalog';
import { decodeCatalogSlugSegment, encodeCatalogSlugSegment } from '@/shared/lib';

interface ProductDetailTopBarProps {
  slug: string[];
}

function getFallbackSegments(slug: string[]): string[] {
  return slug.slice(0, 3).map(decodeCatalogSlugSegment);
}

function BackButtonView({ label, onBack }: { label: string; onBack?: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 text-xs font-bold font-comfortaa text-stone-500 hover:text-stone-900 group cursor-pointer bg-transparent border-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-1"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      <span>Назад в &ldquo;{label}&rdquo;</span>
    </button>
  );
}

/**
 * Читает ?from= — leaf под собственным Suspense, чтобы useSearchParams
 * не выключал prerender всей страницы (use-search-params.md, Next 16).
 * Подпись и пункт назначения всегда из одного источника (segments).
 */
function FromAwareBack({ slug }: ProductDetailTopBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const segments =
    parseBackSource(searchParams?.get('from') ?? null) ?? getFallbackSegments(slug);
  const label = getCatalogBackLabel(segments);

  const handleBack = () => {
    const path = `/catalog/${segments.map(encodeCatalogSlugSegment).join('/')}`;
    // Сохраняем контрактные фильтры (?sort=&min=&max=&brands=&onSale=), чтобы
    // «Назад» внутри приложения не сбрасывал состояние списка, в отличие от
    // браузерной кнопки, которая восстанавливает его из URL.
    const query = new URLSearchParams(searchParams?.toString() ?? '');
    query.delete('from');
    const queryStr = query.toString();
    router.push(queryStr ? `${path}?${queryStr}` : path, { scroll: false });
  };

  return <BackButtonView label={label} onBack={handleBack} />;
}

export default function ProductDetailTopBar({ slug }: ProductDetailTopBarProps) {
  const fallbackSegments = getFallbackSegments(slug);
  return (
    <div className="flex justify-between items-center border-b border-stone-100 pb-4">
      <React.Suspense
        fallback={<BackButtonView label={getCatalogBackLabel(fallbackSegments)} />}
      >
        <FromAwareBack slug={slug} />
      </React.Suspense>
    </div>
  );
}
