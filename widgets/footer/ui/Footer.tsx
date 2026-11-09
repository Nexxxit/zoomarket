'use client';

import Link from 'next/link';
import { MouseEvent } from 'react';
import { Logo } from '@/shared/ui';
import { CONTACT_PHONE, CONTACT_PHONE_HREF, FOOTER_WORK_HOURS } from '@/shared/config/site';
import { catalogLinks, customerLinks, infoLinks, socialLinks, messengerLinks } from '../model/links';

function VkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.785 16.241s.287-.032.434-.194c.135-.149.131-.427.131-.427s-.019-1.304.587-1.496c.596-.19 1.362 1.26 2.173 1.816.613.42 1.079.328 1.079.328l2.165-.03s1.132-.07.595-.96c-.044-.073-.312-.655-1.607-1.852-1.356-1.253-1.174-1.05.458-3.216.994-1.32 1.391-2.126 1.267-2.471-.118-.329-.847-.242-.847-.242l-2.443.015s-.181-.025-.315.055c-.131.079-.215.263-.215.263s-.386 1.027-.9 1.9c-1.084 1.842-1.518 1.939-1.696 1.825-.414-.266-.311-1.07-.311-1.64 0-1.782.271-2.523-.528-2.715-.265-.064-.46-.106-1.138-.113-.87-.009-1.606.003-2.023.207-.278.136-.492.439-.361.456.162.022.529.099.723.364.251.343.242 1.113.242 1.113s.144 2.095-.337 2.355c-.33.178-.782-.185-1.753-1.846-.497-.85-.872-1.79-.872-1.79s-.072-.177-.201-.272c-.156-.115-.374-.151-.374-.151l-2.321.015s-.348.01-.476.161c-.114.134-.009.411-.009.411s1.81 4.236 3.858 6.372c1.878 1.96 4.01 1.832 4.01 1.832h.967z" />
    </svg>
  );
}

function preventHashScroll(event: MouseEvent<HTMLAnchorElement>) {
  if (event.currentTarget.getAttribute('href') === '#') {
    event.preventDefault();
  }
}

export default function Footer() {
  const subscribeStatus = 'idle' as 'idle' | 'done';

  return (
    <footer>

      <div className="bg-stone-800 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:h-16 lg:flex lg:items-center py-3 lg:py-0">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6 w-full">
            <p className="font-comfortaa font-bold text-sm md:text-base text-white shrink-0">
              Лучшие предложения у вас на почте
            </p>

            {subscribeStatus === 'done' ? (
              <p
                role="status"
                className="flex-1 min-w-0 font-inter text-sm text-orange-400"
              >
                Спасибо! Мы свяжемся с вами, когда появятся лучшие предложения.
              </p>
            ) : (
              <form
                onSubmit={(event) => event.preventDefault()}
                className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 flex-1 min-w-0 max-w-xl"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email
                </label>
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  autoComplete="email"
                  className="flex-1 min-w-0 h-9 px-4 rounded-full bg-white text-stone-900 placeholder:text-stone-400 font-inter text-sm border border-transparent focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="h-9 px-5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-comfortaa font-bold text-sm transition-colors shrink-0 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-stone-800"
                >
                  Подписаться
                </button>
              </form>
            )}

            <p className="text-[10px] leading-snug text-stone-400 font-inter lg:max-w-xs lg:ml-auto">
              Нажимая «Подписаться», вы соглашаетесь на обработку персональных данных и с{' '}
              <Link
                href="#"
                onClick={preventHashScroll}
                className="underline hover:text-orange-400 transition-colors"
              >
                политикой конфиденциальности
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

            <div className="space-y-5">
              <Link href="/catalog" className="inline-flex">
                <Logo className="w-12 h-12" />
              </Link>

              <div>
                <p className="text-xs font-inter uppercase tracking-wide text-stone-500 mb-1">
                  Телефон
                </p>
                <a
                  href={CONTACT_PHONE_HREF}
                  className="font-comfortaa font-bold text-lg text-orange-500 hover:text-orange-600 transition-colors"
                >
                  {CONTACT_PHONE}
                </a>
              </div>

              <div>
                <p className="text-xs font-inter uppercase tracking-wide text-stone-500 mb-1">
                  Режим работы
                </p>
                <p className="text-sm font-inter text-stone-600 leading-relaxed">
                  {FOOTER_WORK_HOURS}
                </p>
              </div>

              <div>
                <p className="text-xs font-comfortaa font-bold uppercase tracking-wide text-stone-900 mb-2">
                  Социальные сети
                </p>
                <div className="flex items-center gap-2">
                  {socialLinks.map(({ label, href, external }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      {...(external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : { onClick: preventHashScroll })}
                      className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 bg-white text-[#0077FF] hover:border-[#0077FF] hover:bg-[#0077FF] hover:text-white transition-colors"
                    >
                      <VkIcon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-comfortaa font-bold uppercase tracking-wide text-stone-900 mb-2">
                  Мессенджеры
                </p>
                <div className="flex items-center gap-2">
                  {messengerLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      onClick={preventHashScroll}
                      className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 bg-white text-stone-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-comfortaa font-bold uppercase tracking-wide text-stone-900 text-sm mb-4">
                Каталог
              </h3>
              <ul className="space-y-2.5">
                {catalogLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-inter text-sm text-stone-600 hover:text-orange-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-comfortaa font-bold uppercase tracking-wide text-stone-900 text-sm mb-4">
                Покупателям
              </h3>
              <ul className="space-y-2.5">
                {customerLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={preventHashScroll}
                      className="font-inter text-sm text-stone-600 hover:text-orange-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-comfortaa font-bold uppercase tracking-wide text-stone-900 text-sm mb-4">
                Информация
              </h3>
              <ul className="space-y-2.5">
                {infoLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={preventHashScroll}
                      className="font-inter text-sm text-stone-600 hover:text-orange-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-stone-900 text-stone-400 py-12 px-4 border-t border-stone-800">
        <div className="max-w-7xl mx-auto text-center text-xs font-inter">
          <p>
            © 2026 Сеть зоомаркетов «Айболит». Все права защищены. Лечебные лицензии
            сертифицированы ведомством ухода.
          </p>
        </div>
      </div>
    </footer>
  );
}
