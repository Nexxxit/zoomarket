'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { productHref } from '@/shared/config/navigation';
import { formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib';
import { ProductIcon } from '@/shared/ui';
import { useCartData, useCartActions } from '@/features/cart';
import { useFavorites } from '@/features/favorites';
import { cartLineKey } from '@/entities/cart';
import { getDefaultProductSize } from '../model/defaultSize';
import type { Product } from '../model/types';

interface ProductCardProps {
  product: Product;
  /** Сегменты пути каталога (slug), из которого открыт товар, для кнопки «Назад» на странице товара. */
  backTo?: string;
  className?: string;
}

function ProductCard({ product, backTo, className }: ProductCardProps) {
  const { qtyByKey } = useCartData();
  const { addToCart, updateQty } = useCartActions();
  const { toggleFavorite, isFavorite, isHydrated: favoritesHydrated } = useFavorites();
  // До гидрации хранилища показываем нейтральное состояние — без вспышки demo-лайка.
  const liked = favoritesHydrated && isFavorite(product.id);
  const [selectedSize, setSelectedSize] = React.useState<string | undefined>(
    () => getDefaultProductSize(product)
  );

  const currentQty = qtyByKey.get(cartLineKey(product.id, selectedSize)) ?? 0;

  const detailUrl = backTo
    ? `${productHref(product)}?from=${encodeURIComponent(backTo)}`
    : productHref(product);
  return (
    <div
      className={cn(
        'relative flex flex-col justify-between bg-white rounded-2xl overflow-hidden hover:shadow-aibolit-lg transition-all duration-300 group border border-stone-100 h-full',
        className
      )}
      id={`product-card-${product.id}`}
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
    >

      <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
        {product.onSale && (
          <span className="bg-orange-500 font-comfortaa text-white font-bold text-[11px] px-3 py-1 rounded-full shadow-xs">
            –{product.salePct}%
          </span>
        )}
        {product.badge && (
          <span className="bg-emerald-500 font-comfortaa text-white font-bold text-[11px] px-3 py-1 rounded-full shadow-xs">
            {product.badge}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        aria-label={liked ? `Убрать ${product.name} из избранного` : `Добавить ${product.name} в избранное`}
        aria-pressed={liked}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-xs backdrop-blur-xs transition-colors cursor-pointer ${
          liked ? 'bg-red-50 text-red-500' : 'bg-white/80 hover:bg-white text-stone-400 hover:text-red-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
      </button>

      <Link href={detailUrl} className="relative aspect-square w-full bg-stone-50 flex items-center justify-center overflow-hidden border-b border-stone-50 p-6 block">

        <motion.div
          className="w-full h-full flex items-center justify-center"
          whileHover={{ scale: 1.12, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <ProductIcon alt={product.name} />
        </motion.div>

        <span className="absolute bottom-2 right-2 bg-stone-100/95 text-[10px] font-bold text-stone-600 font-inter px-2.5 py-0.5 rounded-md uppercase tracking-wider">
          {product.category}
        </span>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>

          <div className="flex items-center gap-1 mb-2 font-mono text-[11px] text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-stone-700">{product.rating}</span>
            <span className="text-stone-400">({product.reviews})</span>
          </div>

          <Link href={detailUrl} className="block">
            <h3 className="text-sm md:text-base font-bold text-stone-900 font-comfortaa leading-tight tracking-tight line-clamp-2 hover:text-orange-500 cursor-pointer transition-colors mb-2">
              {product.name}
            </h3>
          </Link>

          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.sizes.map((size) => {
                const isActive = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={isActive}
                    className={`text-[10px] font-bold font-inter px-2 py-1 rounded-md transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200/50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3.5">

          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-black text-orange-500 font-comfortaa">
              {formatPrice(product.price)}
            </span>
            {product.onSale && product.oldPrice && (
              <span className="text-xs md:text-sm text-stone-400 line-through font-inter">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {product.inStock === false ? (
            <button
              disabled
              className="w-full bg-stone-100 text-stone-400 font-bold font-comfortaa py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all text-xs sm:text-sm cursor-not-allowed border-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-1 h-11"
            >
              <span>Нет в наличии</span>
            </button>
          ) : currentQty > 0 ? (
            <div className="flex items-center justify-between w-full bg-stone-100 p-1 rounded-full border border-stone-200/60 h-11">
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => updateQty(product.id, -1, selectedSize)}
                aria-label="Уменьшить количество"
                className="w-9 h-9 rounded-full bg-white hover:bg-orange-50 hover:text-orange-500 border border-stone-200/50 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>
              <span className="text-sm font-extrabold text-stone-900 font-mono">
                {currentQty}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => updateQty(product.id, 1, selectedSize)}
                aria-label="Увеличить количество"
                className="w-9 h-9 rounded-full bg-white hover:bg-orange-50 hover:text-orange-500 border border-stone-200/50 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => addToCart(product, selectedSize)}
              aria-label={`Добавить ${product.name} в корзину`}
              className="w-full bg-stone-900 hover:bg-black text-white font-semibold font-inter py-2.5 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors text-xs sm:text-sm h-11"
            >
              <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5" />
              <span>В корзину</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// memo: сетка/списки перерисовываются на смену фильтров и навигации —
// карточка с теми же props больше не рендерится заново.
export default React.memo(ProductCard);
