'use client';

import type { ReactNode } from 'react';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import type { Product } from '@/entities/product';
import { formatPrice } from '@/shared/lib/format';

interface ProductPurchaseBoxProps {
  product: Product;
  qty: number;
  liked: boolean;
  onAddToCart?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onToggleFavorite?: () => void;
}

export default function ProductPurchaseBox({
  product,
  qty,
  liked,
  onAddToCart,
  onIncrement,
  onDecrement,
  onToggleFavorite,
}: ProductPurchaseBoxProps) {
  let mainAction: ReactNode;

  if (qty > 0) {
    mainAction = (
      <div className="flex-1 flex items-center justify-between bg-white py-1 px-2 rounded-full border border-stone-200 shadow-xs h-13">
        <button
          type="button"
          onClick={onDecrement}
          className="w-10 h-10 rounded-full bg-stone-50 hover:bg-orange-50 hover:text-orange-500 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer border-0"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-base font-black text-stone-900 font-mono">
          {qty} шт.
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="w-10 h-10 rounded-full bg-stone-50 hover:bg-orange-50 hover:text-orange-500 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer border-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  } else if (product.inStock === false) {
    mainAction = (
      <button
        disabled
        className="flex-1 bg-stone-100 text-stone-400 font-bold font-comfortaa py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all text-sm cursor-not-allowed border-0 outline-none h-13"
      >
        <span>Товар временно отсутствует</span>
      </button>
    );
  } else {
    mainAction = (
      <button
        type="button"
        onClick={onAddToCart}
        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 text-sm cursor-pointer border-0 outline-none h-13"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Добавить в корзину</span>
      </button>
    );
  }

  return (
    <div className="bg-stone-50 border border-stone-100 rounded-3xl p-5 space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-black text-orange-500 font-comfortaa">
          {formatPrice(product.price)}
        </span>
        {product.onSale && product.oldPrice && (
          <span className="text-sm sm:text-base text-stone-400 line-through font-inter">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {mainAction}
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={liked ? `Убрать ${product.name} из избранного` : `Добавить ${product.name} в избранное`}
          aria-pressed={liked}
          className={`p-3.5 rounded-full border border-stone-200 transition-colors flex items-center justify-center cursor-pointer h-13 w-13 ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white text-stone-500 hover:bg-stone-50'
            }`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
