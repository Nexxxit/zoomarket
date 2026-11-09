'use client';

import Image from 'next/image';
import type { Product } from '@/entities/product';

interface ProductImagePanelProps {
  product: Product;
}

export default function ProductImagePanel({ product }: ProductImagePanelProps) {
  return (
    <div className="bg-stone-50 rounded-3xl p-8 flex items-center justify-center aspect-square border border-stone-100/50 relative overflow-hidden group">
      <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
        {product.onSale && (
          <span className="bg-orange-500 text-white text-xs font-black font-comfortaa px-3 py-1 rounded-full shadow-xs">
            Скидка –{product.salePct}%
          </span>
        )}
        {product.badge && (
          <span className="bg-emerald-500 text-white text-xs font-black font-comfortaa px-3 py-1 rounded-full shadow-xs">
            {product.badge}
          </span>
        )}
      </div>
      <div className="scale-150 group-hover:scale-175 transition-transform duration-500">
        <Image
          src="/logo_aibolit.jpg"
          alt={product.name}
          width={144}
          height={144}
          className="w-36 h-36 object-cover rounded-full"
        />
      </div>
    </div>
  );
}
