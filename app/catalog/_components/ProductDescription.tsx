'use client';

import type { Product } from '@/entities/product';

interface ProductDescriptionProps {
  product: Product;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const paragraphs = product.description ?? [];
  const specifications = product.specifications ?? [];

  if (paragraphs.length === 0 && specifications.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-stone-100 pt-8 space-y-6">
      <h3 className="text-sm font-black font-comfortaa text-stone-900 uppercase tracking-wider">Описание и характеристики товара</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-3 text-xs leading-relaxed text-stone-600 font-inter">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {specifications.length > 0 && (
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 font-inter space-y-2.5 text-xs text-stone-600">
            <span className="font-bold text-stone-800 block">Спецификация:</span>
            {specifications.map((spec, index) => (
              <div
                key={spec.label}
                className={
                  index === specifications.length - 1
                    ? 'flex justify-between pb-1'
                    : 'flex justify-between border-b border-stone-200/50 pb-1.5'
                }
              >
                <span>{spec.label}</span>
                <span className="font-semibold text-stone-800">{spec.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
