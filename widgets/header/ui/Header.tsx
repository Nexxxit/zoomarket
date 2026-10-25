'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Heart, ShoppingBag, Search, Menu, X, User, Phone,
} from 'lucide-react';

import { motion } from 'motion/react';
import { INITIAL_CART_ITEMS, selectCartCount } from '@/entities/cart';
import { DEMO_USER } from '@/entities/user';
import { productHref } from '@/shared/config/navigation';
import { formatPrice } from '@/shared/lib/format';
import { CONTACT_PHONE, CONTACT_PHONE_HREF, WORK_HOURS, TOP_BAR_LINKS } from '@/shared/config/site';
import { Navbar } from '@/widgets/navbar';
import { AuthDrawer } from '@/features/auth';
import { useHeaderSearch } from '../model/useHeaderSearch';

export default function Header() {
  const pathname = usePathname();

  const cartCount = selectCartCount(INITIAL_CART_ITEMS);

  const search = useHeaderSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const user = DEMO_USER;
  return (
    <>
      {search.isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onMouseDown={search.close}
        />
      )}

      <div className="bg-stone-900 text-stone-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-10 text-xs font-inter">
            <nav className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-5 shrink-0">
              {TOP_BAR_LINKS.map((link, index) => {
                const visibility = index < 5 ? '' : 'hidden xl:inline';

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`whitespace-nowrap text-stone-300 hover:text-white transition-colors ${visibility}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 lg:gap-3.5 shrink-0 ml-auto">
              <span className="hidden xl:inline text-stone-400 whitespace-nowrap">
                {WORK_HOURS}
              </span>
              <a
                href={CONTACT_PHONE_HREF}
                className="flex items-center gap-1.5 text-white hover:text-orange-400 transition-colors whitespace-nowrap"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white shrink-0">
                  <Phone className="w-2.5 h-2.5" strokeWidth={2.5} />
                </span>
                <span className="font-semibold tracking-tight">{CONTACT_PHONE}</span>
              </a>
              <a
                href="#callback"
                className="text-orange-500 hover:text-orange-400 font-medium whitespace-nowrap transition-colors"
              >
                Заказать звонок
              </a>
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full">
        <div className="transition-colors duration-300 backdrop-blur-md border-b border-stone-200/30 bg-transparent hover:bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3 md:gap-4">

            <Link href="/catalog" className="flex-shrink-0 flex items-center gap-2 group">
              <Image
                src="/logo_aibolit.jpg"
                alt="Айболит"
                width={52}
                height={52}
                className="w-10 h-10 md:w-11 md:h-11 object-cover rounded-full group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col select-none text-left">
                <span className="text-lg md:text-xl font-black font-comfortaa text-stone-900 leading-none tracking-tight">
                  Айболит
                </span>
                <span className="text-[9px] md:text-[10px] font-extrabold text-orange-500 font-inter uppercase tracking-wider mt-0.5">
                  Заботливый зоомаркет
                </span>
              </div>
            </Link>

            <div className="flex-1 relative z-50">
              <form onSubmit={(e) => e.preventDefault()} className="w-full relative flex items-center">
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
                  className="w-full pl-11 pr-10 py-2.5 md:py-3 bg-white/90 hover:bg-white border border-stone-200/80 text-stone-900 rounded-full text-xs md:text-sm font-inter focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-2xs transition-all placeholder:text-stone-400 font-medium"
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
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-stone-100 bg-stone-50 overflow-hidden p-1">
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
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-black text-orange-600 font-mono">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </Link>
                      ))}
                      <div className="mt-1.5 pb-1 px-1">
                        <button
                          type="button"
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

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link href="/favorites" className="relative block">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-full transition-colors relative bg-white/70 backdrop-blur-sm border border-stone-200/60 shadow-2xs ${
                    pathname === '/favorites'
                      ? 'bg-orange-50 text-orange-600 border-orange-200'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                  title="Избранное"
                >
                  <Heart className="w-5 h-5 stroke-[1.8]" />
                </motion.div>
              </Link>

              <Link href="/cart" className="relative block">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-full text-white transition-colors relative shadow-2xs ${
                    pathname === '/cart' ? 'bg-orange-600' : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                  title="Корзина"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[2]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white min-w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px] px-1 animate-bounce shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </motion.div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setAuthOpen(true)}
                aria-label="Личный кабинет"
                className={
                  user
                    ? 'w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm border border-orange-200 cursor-pointer shrink-0 p-0'
                    : 'p-2.5 rounded-full text-stone-700 bg-white/70 backdrop-blur-sm border border-stone-200/60 shadow-2xs hover:bg-stone-100 hover:text-orange-500 transition-colors relative flex items-center justify-center cursor-pointer'
                }
                title="Личный кабинет"
              >
                {user ? user.avatar : <User className="w-5 h-5 stroke-[1.8]" />}
              </motion.button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-expanded={mobileMenuOpen}
                aria-label="Меню каталога"
                className="p-2.5 md:hidden rounded-full text-stone-600 bg-white/80 border border-stone-200/60 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

          <Navbar mobileMenuOpen={mobileMenuOpen} onCloseMenu={closeMobileMenu} />
        </div>

      </header>

      <AuthDrawer open={authOpen} user={user} onClose={() => setAuthOpen(false)} />
    </>
  );
}
