'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { categoryNavItems } from '../model/navItems';

export default function Navbar() {
  const pathname = usePathname();

  const mobileMenuOpen = false;

  return (
    <>
      <div className="pt-1 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 overflow-x-auto py-1 no-scrollbar scrollbar-none text-xs sm:text-sm font-extrabold font-comfortaa"
          >
            {categoryNavItems.map((item) => {
              const isActive =
                item.id === 'promotions'
                  ? pathname === '/promotions'
                  : item.match(pathname);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active-nav={isActive ? "true" : "false"}
                  className={`inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-1.5 rounded-full transition-all text-xs sm:text-sm cursor-pointer ${
                    isActive 
                      ? 'bg-stone-900 text-white font-black shadow-xs scale-105' 
                      : item.isPromo
                      ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50/60 font-black'
                      : 'text-stone-800 hover:text-orange-600 hover:bg-white/80 font-extrabold'
                  }`}
                >
                  <Icon
                    className="w-4 h-4 sm:w-[1.125rem] sm:h-[1.125rem] shrink-0"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-stone-200 bg-white overflow-hidden shadow-xl"
          >
            <div className="px-4 py-4 space-y-2 font-comfortaa">
              <Link
                href="/catalog"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm"
              >
                <Menu className="w-5 h-5" />
                <span>Весь каталог</span>
              </Link>

              <div className="pt-2 pb-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2">
                Разделы зоомаркета
              </div>

              <div className="grid grid-cols-2 gap-2">
                {categoryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs transition-colors ${
                        item.isPromo
                          ? 'bg-orange-500 text-white font-black'
                          : 'bg-stone-50 hover:bg-orange-50 text-stone-800 font-extrabold'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
