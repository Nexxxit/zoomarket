'use client';

import React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { Check, PawPrint } from 'lucide-react';
import type { CartItem } from '@/entities/cart';
import { StarRating, useRatings } from '@/features/rating';

const WINDOW_SIZE = 3;
const CELEBRATE_MS = 750;

interface RatePurchasedProps {
  purchasedItems: CartItem[];
}

const keyOf = (item: CartItem) => `${item.id}-${item.size ?? ''}`;

export default function RatePurchased({ purchasedItems }: RatePurchasedProps) {
  const { productRatings, submitProductRating } = useRatings();
  const [justRated, setJustRated] = React.useState<Record<string, number>>({});
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const remaining = purchasedItems.filter(
    (item) =>
      !(productRatings[item.id]?.userRating !== undefined && justRated[keyOf(item)] === undefined)
  );
  const visible = remaining.slice(0, WINDOW_SIZE);
  const total = purchasedItems.length;
  const doneCount = total - remaining.length;

  if (total === 0) return null;

  const handleRate = (item: CartItem, rating: number) => {
    const k = keyOf(item);
    if (justRated[k] !== undefined) return;
    setJustRated((prev) => ({ ...prev, [k]: rating }));
    submitProductRating(item.id, rating);
    timersRef.current.push(
      setTimeout(() => {
        setJustRated((prev) => {
          if (prev[k] === undefined) return prev;
          const next = { ...prev };
          delete next[k];
          return next;
        });
      }, CELEBRATE_MS)
    );
  };

  return (
    <div className="bg-white border border-stone-150 rounded-[28px] p-6 shadow-xs space-y-5">
      <div className="space-y-2.5 border-b border-stone-100 pb-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
            <span>Оцените купленные товары</span>
          </h2>
          <span className="text-[10px] font-mono text-stone-400 whitespace-nowrap">
            {doneCount} из {total}
          </span>
        </div>
        <p className="text-xs text-stone-500 font-inter">
          Помогите другим владельцам животных с выбором. Оценивайте товары по одному — на смену сразу придёт следующий!
        </p>
        <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-orange-500"
            initial={false}
            animate={{ width: `${total > 0 ? (doneCount / total) * 100 : 0}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {remaining.length === 0 ? (
          <motion.div
            key="all-rated"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="py-8 flex flex-col items-center gap-3 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500"
            >
              <PawPrint className="w-7 h-7" />
            </motion.div>
            <p className="text-sm font-bold font-comfortaa text-stone-800">Спасибо за оценки! 🐾</p>
            <p className="text-xs text-stone-500 font-inter">
              Вы помогли другим владельцам животных сделать правильный выбор.
            </p>
          </motion.div>
        ) : (
          visible.map((item) => {
            const k = keyOf(item);
            const inFlight = justRated[k] !== undefined;
            return (
              <motion.div
                key={k}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.4, ease: 'easeOut' },
                  default: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                }}
                className="py-4 first:pt-0 last:pb-0 border-b border-stone-100 last:border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                    <Image
                      src="/logo_aibolit.jpg"
                      alt=""
                      width={32}
                      height={32}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-800 block line-clamp-1 leading-tight">{item.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">{item.size || 'Стандартный размер'} • {item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <StarRating
                    value={justRated[k] ?? 0}
                    onSelect={inFlight ? undefined : (rating) => handleRate(item, rating)}
                    containerClassName="flex items-center gap-1"
                    starClassName="w-5 h-5"
                    ariaLabelTemplate={'Оценить на ${stars}'}
                  />

                  <div className="relative flex w-24 h-6 items-center justify-center">
                    <AnimatePresence mode="wait" initial={false}>
                      {inFlight ? (
                        <motion.span
                          key="thanks"
                          initial={{ opacity: 0, scale: 0.7, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                          className="absolute flex items-center gap-1 text-[10px] font-bold text-emerald-600 whitespace-nowrap"
                        >
                          <Check className="w-3 h-3" />
                          Спасибо!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="hint"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, transition: { duration: 0.12 } }}
                          transition={{ duration: 0.25 }}
                          className="absolute text-[10px] text-stone-400 font-medium whitespace-nowrap"
                        >
                          Оценить
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
