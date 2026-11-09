'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { LottiePlayer } from '@/shared/ui';

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full bg-white rounded-4xl px-8 py-16 md:p-16 border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6"
    >
      <div className="h-48 w-64 mx-auto">
        <LottiePlayer type="sleeping-cat" className="h-full w-full" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold font-comfortaa text-stone-900">
          В вашей корзине пусто!
        </h2>
        <p className="text-sm text-stone-500 font-inter leading-relaxed">
          Похоже, вы еще не баловали своих питомцев... Пора положить им вкусняшки или новые игрушки!
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa text-sm rounded-full shadow-md"
        >
          Вернуться за покупками
        </Link>
      </div>
    </motion.div>
  );
}
