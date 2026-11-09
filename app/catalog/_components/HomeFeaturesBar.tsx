'use client';

import { HOME_FEATURES } from '@/shared/config/site';

export default function HomeFeaturesBar() {
  return (
    <section aria-label="Преимущества магазина">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-7">
        <ul className="flex w-full flex-col gap-y-4 list-none m-0 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-5 lg:flex-nowrap lg:items-center lg:justify-between lg:gap-x-0">
          {HOME_FEATURES.map(({ id, icon: Icon, lines }) => (
            <li key={id} className="flex items-center gap-3 min-w-0 sm:basis-[calc(50%-1rem)] lg:basis-auto lg:shrink-0">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-orange-50 shrink-0">
                <Icon className="w-6 h-6 text-orange-500" strokeWidth={2} aria-hidden />
              </div>
              <p className="min-w-0 text-xs font-normal font-inter text-stone-700 leading-snug">
                {lines[0]}
                {lines[1] ? (
                  <>
                    {' '}
                    <span className="block">{lines[1]}</span>
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
