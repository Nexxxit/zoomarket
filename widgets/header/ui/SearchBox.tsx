'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import { productHref } from '@/shared/config/navigation';
import { formatPrice } from '@/shared/lib/format';
import { useHeaderSearch } from '../model/useHeaderSearch';

/**
 * Свой client-остров поиска шапки: стейт запроса живёт здесь, поэтому
 * ввод в поле не перерисовывает весь Header (корзина/профиль/навигация).
 */
export default function SearchBox() {
  const search = useHeaderSearch();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // onBlur закрывает дропдаун, если фокус ушёл наружу (чинит «залипание»
  // при Tab/клике вне). Слушаем на контейнере (focusout всплывает): Tab
  // сквозь результаты и уход фокуса дальше тоже закрывают панель. Клик по
  // результатам не теряет фокус: onMouseDown на панели preventDefault не
  // даёт input потерять фокус до наступления click.
  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && containerRef.current?.contains(next)) return;
    search.close();
  };

  return (
    <div ref={containerRef} onBlur={handleBlur} className="flex-1 relative z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search.goToResults();
        }}
        className="w-full relative flex items-center"
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-stone-400" />
        </div>
        <input
          type="text"
          aria-label="Поиск по каталогу"
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          onFocus={search.open}
          onKeyDown={(e) => {
            if (e.key === 'Escape') search.close();
          }}
          placeholder="Поиск по товарам, брендам, категориям..."
          className="w-full pl-11 pr-10 py-2.5 md:py-3 bg-white/90 hover:bg-white border border-stone-200/80 text-stone-900 rounded-full text-xs md:text-sm font-inter focus:outline-hidden focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-2xs transition-all placeholder:text-stone-400 font-medium"
        />
        {search.query && (
          <button
            type="button"
            onClick={search.reset}
            className="absolute right-4 text-stone-400 hover:text-stone-600 bg-transparent border-none p-0 cursor-pointer flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {search.isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden z-50 text-left font-inter"
        >
          {search.results.length > 0 ? (
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-[10px] font-extrabold text-stone-500 uppercase tracking-wider font-comfortaa bg-stone-50/80 rounded-xl border border-stone-100/50 flex items-center justify-between">
                <span>Найдено товаров: {search.total}</span>
              </div>
              {search.results.map((product) => (
                <Link
                  key={product.id}
                  href={productHref(product)}
                  onClick={search.close}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/40 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-stone-100 bg-stone-50 overflow-hidden p-1">
                    <Image
                      src="/logo_aibolit.jpg"
                      alt=""
                      width={32}
                      height={32}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-800 line-clamp-1 leading-snug group-hover:text-orange-500 transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-stone-400">
                      {product.brand && (
                        <span className="font-extrabold font-comfortaa text-[9px] text-orange-650 bg-orange-50/80 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                          {product.brand}
                        </span>
                      )}
                      <span>•</span>
                      <span className="font-medium text-stone-500">{product.category}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-orange-600 font-mono">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
              <div className="mt-1.5 pb-1 px-1">
                <button
                  type="button"
                  onClick={search.goToResults}
                  className="w-full text-center py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold font-comfortaa text-xs rounded-xl transition-all cursor-pointer border-none shadow-xs"
                >
                  Показать все результаты поиска
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center space-y-1">
              <span className="text-2xl" aria-hidden="true">😿</span>
              <p className="text-xs font-bold text-stone-800 font-comfortaa">Ничего не найдено</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
