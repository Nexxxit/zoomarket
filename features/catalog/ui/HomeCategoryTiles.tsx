'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ALL_MOCK_CATEGORIES,
  getSubcategoriesSync,
} from '@/entities/catalog';

const HOME_TILE_LAYOUT: Record<
  string,
  { bg: string; colSpan: string; order: number }
> = {
  dog: {
    bg: 'bg-[#F3E4D4]',
    colSpan: 'col-span-2 sm:col-span-1 md:col-span-5',
    order: 1,
  },
  cat: {
    bg: 'bg-[#EBE7E1]',
    colSpan: 'col-span-2 sm:col-span-1 md:col-span-5',
    order: 2,
  },
  vet: {
    bg: 'bg-[#F3D9DE]',
    colSpan: 'col-span-2 sm:col-span-1 md:col-span-2',
    order: 3,
  },
  rodent: {
    bg: 'bg-[#F5E6D8]',
    colSpan: 'col-span-1 md:col-span-4',
    order: 4,
  },
  bird: {
    bg: 'bg-[#D4E8F2]',
    colSpan: 'col-span-1 md:col-span-4',
    order: 5,
  },
  fish: {
    bg: 'bg-[#E4DCEF]',
    colSpan: 'col-span-2 sm:col-span-1 md:col-span-4',
    order: 6,
  },
  brands: {
    bg: 'bg-[#E6DCCE]',
    colSpan: 'col-span-2 md:col-span-12',
    order: 7,
  },
};

function formatProductCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} товар`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} товара`;
  }
  return `${count} товаров`;
}

function getProductCountForCategory(categoryId: string): number {
  if (categoryId === 'brands') {
    return ALL_MOCK_CATEGORIES.filter((c) => c.id !== 'brands').reduce(
      (total, category) => total + getProductCountForCategory(category.id),
      0
    );
  }

  return getSubcategoriesSync(categoryId).reduce(
    (total, sub) => total + (sub.itemCount || 0),
    0
  );
}

export default function HomeCategoryTiles() {
  const tiles = [...ALL_MOCK_CATEGORIES]
    .map((category) => ({
      category,
      productCount: getProductCountForCategory(category.id),
      layout: HOME_TILE_LAYOUT[category.id] ?? {
        bg: 'bg-stone-100',
        colSpan: 'col-span-2 md:col-span-4',
        order: 99,
      },
    }))
    .sort((a, b) => a.layout.order - b.layout.order);

  return (
    <div className="grid grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4">
      {tiles.map(({ category, layout, productCount }) => (
        <Link
          key={category.id}
          href={`/catalog/${category.id}`}
          className={`${layout.colSpan} ${layout.bg} relative flex items-stretch rounded-2xl overflow-hidden min-h-[8.5rem] sm:min-h-[9.5rem] md:min-h-[10.5rem] group transition-all duration-300 hover:shadow-md hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2`}
        >
          <div className="relative z-10 flex flex-col justify-start gap-1 p-4 sm:p-5 pr-[42%] sm:pr-[40%]">
            <span className="text-base sm:text-lg md:text-xl font-black font-comfortaa text-stone-900 leading-tight group-hover:text-orange-600 transition-colors">
              {category.name}
            </span>
            <span className="text-xs sm:text-sm font-medium text-stone-500/90">
              {formatProductCount(productCount)}
            </span>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 w-[42%] sm:w-[40%] flex items-center justify-end pr-2 sm:pr-3 md:pr-4">
            <div className="relative w-[88%] max-w-[9.5rem] aspect-square rounded-full overflow-hidden shadow-sm ring-2 ring-white/50 bg-white/20 group-hover:scale-105 transition-transform duration-300 origin-center">
              <Image
                src="/logo_aibolit.jpg"
                alt={category.name}
                width={160}
                height={160}
                className="object-cover w-full h-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
