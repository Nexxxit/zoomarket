'use client';

import { useCallback, memo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Heart, ShoppingBag, Menu, X, User, Phone,
} from 'lucide-react';

import { motion } from 'motion/react';
import { selectCartCount } from '@/entities/cart';
import { useCart } from '@/features/cart';
import { CONTACT_PHONE, CONTACT_PHONE_HREF, WORK_HOURS, TOP_BAR_LINKS } from '@/shared/config/site';
import { Navbar } from '@/widgets/navbar';
import { AuthDrawer, useAuthSession } from '@/features/auth';
import SearchBox from './SearchBox';

const MemoNavbar = memo(Navbar);

export default function Header() {
  const pathname = usePathname();

  const { cart, isHydrated } = useCart();
  const cartCount = selectCartCount(cart);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  // Только сеанс: статусы login/logout-запросов не перерисовывают шапку.
  const { user, isHydrated: authHydrated } = useAuthSession();
  return (
    <>
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
                href={CONTACT_PHONE_HREF}
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

            <Link href="/catalog" className="shrink-0 flex items-center gap-2 group">
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

            <SearchBox />

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link href="/favorites" className="relative block">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-full transition-colors relative bg-white/70 backdrop-blur-xs border border-stone-200/60 shadow-2xs ${
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
                  {/* До гидрации хранилища бедж скрыт — без вспышки demo-корзины */}
                  {isHydrated && cartCount > 0 && (
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
                    ? 'w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-xs border border-orange-200 cursor-pointer shrink-0 p-0'
                    : 'p-2.5 rounded-full text-stone-700 bg-white/70 backdrop-blur-xs border border-stone-200/60 shadow-2xs hover:bg-stone-100 hover:text-orange-500 transition-colors relative flex items-center justify-center cursor-pointer'
                }
                title="Личный кабинет"
              >
                {/* Аватар показываем только после завершённого restore сеанса */}
                {user && authHydrated ? user.avatar : <User className="w-5 h-5 stroke-[1.8]" />}
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

          <MemoNavbar mobileMenuOpen={mobileMenuOpen} onCloseMenu={closeMobileMenu} />
        </div>

      </header>

      <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
