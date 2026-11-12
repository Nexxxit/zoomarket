'use client';

import React from 'react';
import { motion } from 'motion/react';

// Декоративные сцен-петли стартуют только при первом появлении во вьюпорте
// (whileInView): off-screen анимации не жгут CPU сразу после загрузки.
const VIEWPORT_ONCE = { once: true };

type AnimationType =
  | 'sleeping-cat'
  | 'happy-tail'
  | 'bouncing-ball'
  | 'droplet-preloader'
  | 'courier-scooter'
  | 'promotions-confetti'
  | 'decor-paws'
  | 'playing-pet-toys';

interface LottiePlayerProps {
  type: AnimationType;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function LottiePlayer({ type, className = '', width = '100%', height = '100%' }: LottiePlayerProps) {
  if (type === 'sleeping-cat') {
    return (
      <div className={`flex flex-col items-center justify-center p-5 bg-amber-50/20 rounded-[28px] border border-amber-100/50 ${className}`} style={{ width, height }}>
        <div className="relative w-48 h-32 flex items-center justify-center">

          <motion.span
            className="absolute right-10 top-2 font-comfortaa text-orange-400 font-bold text-xs select-none"
            whileInView={{ y: [-5, -20], x: [0, 5], opacity: [0, 1, 0], scale: [0.8, 1.2] }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          >
            z
          </motion.span>
          <motion.span
            className="absolute right-6 top-5 font-comfortaa text-orange-500 font-bold text-lg select-none"
            whileInView={{ y: [-5, -25], x: [0, -8], opacity: [0, 1, 0], scale: [0.8, 1.3] }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: "easeOut" }}
          >
            Z
          </motion.span>
          <motion.span
            className="absolute right-12 top-8 font-comfortaa text-orange-500 font-bold text-sm select-none"
            whileInView={{ y: [-5, -18], x: [0, 10], opacity: [0, 1, 0], scale: [0.8, 1.1] }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 2, delay: 1.2, ease: "easeOut" }}
          >
            z
          </motion.span>

          <svg viewBox="0 0 120 80" className="w-full h-full">

            <ellipse cx="60" cy="65" rx="42" ry="11" fill="#FCE7F3" opacity="0.8" stroke="#FBCFE8" strokeWidth="1" />

            <motion.g
              whileInView={{ scaleY: [1, 1.05, 1], y: [0, -2, 0] }}
              viewport={VIEWPORT_ONCE}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            >

              <path
                d="M32,60 C24,52 32,36 50,34 C65,32 88,34 88,48 C88,58 84,63 60,63 C42,63 35,62 32,60 Z"
                fill="#FB923C"
                stroke="#EA580C"
                strokeWidth="1.5"
              />

              <path d="M48,34 C49,39 53,39 55,34 Z" fill="#E11D48" opacity="0.15" />
              <path d="M56,33 C58,39 63,39 65,33 Z" fill="#F97316" />
              <path d="M66,33 C68,40 73,40 75,33 Z" fill="#F97316" />

              <path d="M38,38 L31,24 L44,34 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1" />
              <path d="M38,38 L34,27 L41,34 Z" fill="#FECDD3" /> {}

              <path d="M48,36 L49,21 L56,33 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1" />
              <path d="M48,36 L50,24 L53,33 Z" fill="#FECDD3" /> {}

              <path d="M34,48 Q37,51 40,48" stroke="#451A03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M44,47 Q47,50 50,47" stroke="#451A03" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              <circle cx="32" cy="52" r="3" fill="#FDA4AF" opacity="0.8" />
              <circle cx="51" cy="51" r="3" fill="#FDA4AF" opacity="0.8" />

              <polygon points="42,50 40,48 44,48" fill="#F43F5E" />
              <path d="M41,51 Q42,52 43,51" stroke="#451A03" strokeWidth="1" fill="none" />

              <path d="M86,52 C94,52 96,62 88,61" stroke="#F97316" strokeWidth="4" fill="none" strokeLinecap="round" />
            </motion.g>
          </svg>
        </div>
        <p className="text-xs font-bold text-amber-900/80 font-comfortaa mt-1 select-none">Тсс... Хвостик спит</p>
      </div>
    );
  }

  if (type === 'happy-tail') {
    return (
      <div className={`flex flex-col items-center justify-center p-4 bg-green-50/20 rounded-2xl ${className}`} style={{ width, height }}>
        <div className="relative w-48 h-32 flex items-center justify-center">

          <motion.span
            className="absolute left-10 top-4 text-red-400 text-lg"
            whileInView={{ y: [10, -25], x: [0, -10], opacity: [0, 1, 0], scale: [0.5, 1.2] }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.2 }}
          >
            ❤️
          </motion.span>
          <motion.span
            className="absolute right-10 top-2 text-orange-400 text-base"
            whileInView={{ y: [10, -20], x: [0, 8], opacity: [0, 1, 0], scale: [0.5, 1.1] }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
          >
            🧡
          </motion.span>
          <motion.span
            className="absolute left-24 top-0 text-green-400 text-sm"
            whileInView={{ y: [15, -15], x: [10, -5], opacity: [0, 1, 0], scale: [0.6, 1.3] }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 2, delay: 0 }}
          >
            ✨
          </motion.span>

          <svg viewBox="0 0 120 80" className="w-full h-full">

            <ellipse cx="60" cy="68" rx="35" ry="6" fill="#E2E8F0" />

            <circle cx="60" cy="50" r="18" fill="#B45309" /> {}
            <circle cx="50" cy="46" r="6" fill="#D97706" /> {}
            <circle cx="70" cy="46" r="6" fill="#D97706" /> {}

            <g transform="translate(60, 48)">
              <motion.g
                whileInView={{ rotate: [-30, 30, -30] }}
                viewport={VIEWPORT_ONCE}
                transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
              >

                <path d="M0,0 C8,-10 4,-26 12,-30 C15,-26 11,-10 0,0" fill="#D97706" />

                <path d="M9,-24 C11,-27 11,-29 12,-30 C15,-26 12,-22 9,-24" fill="#F8FAFC" />
              </motion.g>
            </g>

            <path d="M38,36 C35,28 32,32 30,36 Z" fill="#78350F" />
            <path d="M82,36 C85,28 88,32 90,36 Z" fill="#78350F" />
            <circle cx="60" cy="30" r="10" fill="#B45309" /> {}
          </svg>
        </div>
        <p className="text-xs font-semibold text-green-600 font-inter mt-1">Заказ оформлен! Хвостик виляет!</p>
      </div>
    );
  }

  if (type === 'bouncing-ball') {
    return (
      <div className={`flex flex-col items-center justify-center p-2 ${className}`} style={{ width, height }}>
        <div className="relative w-16 h-16 flex flex-col items-center justify-end">

          <motion.div
            className="w-10 h-1.5 bg-stone-300 rounded-full"
            whileInView={{
              scaleX: [1, 0.4, 1.1, 1],
              opacity: [0.6, 0.15, 0.8, 0.6]
            }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute w-10 h-10 rounded-full bg-linear-to-tr from-orange-600 via-orange-500 to-amber-300 flex items-center justify-center border-2 border-white shadow-md cursor-pointer"
            whileInView={{
              y: [0, -32, 0],
              scaleY: [0.8, 1.1, 0.8, 0.82],
              scaleX: [1.2, 0.9, 1.2, 1.1]
            }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          >

            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/90 fill-current">
              <circle cx="12" cy="14" r="4.5" />
              <circle cx="6" cy="7.5" r="3" />
              <circle cx="12" cy="5.5" r="3" />
              <circle cx="18" cy="7.5" r="3" />
            </svg>
          </motion.div>
        </div>
      </div>
    );
  }

  if (type === 'droplet-preloader') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`} style={{ width, height }}>
        <div className="relative w-24 h-24 flex items-center justify-center flex-col">
          <svg viewBox="0 0 100 100" className="w-20 h-20">

            <motion.circle
              cx="50"
              cy="75"
              r="2"
              fill="none"
              stroke="#22C55E"
              strokeWidth="1.5"
              whileInView={{ r: [2, 28], opacity: [1, 0] }}
              viewport={VIEWPORT_ONCE}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
            />
            <motion.circle
              cx="50"
              cy="75"
              r="2"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="1"
              whileInView={{ r: [2, 18], opacity: [1, 0] }}
              viewport={VIEWPORT_ONCE}
              transition={{ repeat: Infinity, duration: 1.6, delay: 0.8, ease: "easeOut" }}
            />

            <ellipse cx="50" cy="75" rx="30" ry="4" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1" />

            <motion.g
              whileInView={{ y: [0, 48, 0] }}
              viewport={VIEWPORT_ONCE}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeIn" }}
            >

              <path
                d="M50,15 C45,23 41,29 41,35 C41,41 45,45 50,45 C55,45 59,41 59,35 C59,29 55,23 50,15 Z"
                fill="#22C55E"
              />

              <rect x="49" y="30" width="2" height="8" rx="1" fill="#FFFFFF" />
              <rect x="46" y="33" width="8" height="2" rx="1" fill="#FFFFFF" />
            </motion.g>
          </svg>
          <span className="text-[11px] font-mono font-bold text-green-600 uppercase tracking-widest mt-1">АЙБОЛИТ ТЕСТ</span>
        </div>
      </div>
    );
  }

  if (type === 'courier-scooter') {
    return (
      <div className={`relative flex flex-col items-center justify-center overflow-visible ${className}`} style={{ width, height }}>

        <motion.div
          className="absolute left-8 top-8 w-16 h-5 bg-white rounded-full opacity-60"
          whileInView={{ x: [-80, 240] }}
          viewport={VIEWPORT_ONCE}
          transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
        />
        <motion.div
          className="absolute right-4 top-14 w-10 h-3 bg-white rounded-full opacity-40"
          whileInView={{ x: [-200, 120] }}
          viewport={VIEWPORT_ONCE}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        />

        <div className="relative w-64 h-36">

          <div className="absolute bottom-5 left-0 right-0 h-1 bg-stone-200 overflow-hidden">
            <motion.div
              className="w-[200%] h-full flex"
              whileInView={{ x: [0, -100] }}
              viewport={VIEWPORT_ONCE}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <div className="w-1/2 flex justify-around">
                <div className="w-10 h-full bg-stone-300 rounded-sm" />
                <div className="w-10 h-full bg-stone-300 rounded-sm" />
                <div className="w-10 h-full bg-stone-300 rounded-sm" />
              </div>
              <div className="w-1/2 flex justify-around">
                <div className="w-10 h-full bg-stone-300 rounded-sm" />
                <div className="w-10 h-full bg-stone-300 rounded-sm" />
                <div className="w-10 h-full bg-stone-300 rounded-sm" />
              </div>
            </motion.div>
          </div>

          <motion.div
            className="absolute left-10 bottom-6 w-44 h-24"
            whileInView={{ y: [0, -3, 0] }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
          >
            <svg viewBox="0 0 100 60" className="w-full h-full">

              <rect x="5" y="14" width="22" height="20" rx="4" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />

              <circle cx="16" cy="24" r="3" fill="#FFFFFF" />
              <circle cx="12" cy="19" r="1.5" fill="#FFFFFF" />
              <circle cx="16" cy="17" r="1.5" fill="#FFFFFF" />
              <circle cx="20" cy="19" r="1.5" fill="#FFFFFF" />

              <path d="M12,34 L40,34 L55,44 L72,44 L78,30 L68,18" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
              <rect x="35" y="29" width="28" height="10" rx="3" fill="#D1D5DB" />

              <line x1="72" y1="44" x2="80" y2="17" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <line x1="76" y1="17" x2="84" y2="17" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

              <g transform="translate(43, 6) scale(0.9)">

                <g transform="translate(4.5, 21.5)">
                  <motion.g
                    whileInView={{ rotate: [-15, 15, -15] }}
                    viewport={VIEWPORT_ONCE}
                    transition={{ repeat: Infinity, duration: 0.15, ease: "easeInOut" }}
                  >

                    <path d="M0,0 Q-8,4 -13,2 Q-15,-1 -11,-3 Q-6,-3 0,0" fill="#78350F" stroke="#92400E" strokeWidth="0.5" />

                    <path d="M-11,-3 Q-15,-1 -13,2 Q-10,1 -11,-3" fill="#FFFFFF" />
                  </motion.g>
                </g>

                <ellipse cx="10" cy="18" rx="8" ry="10" fill="#B45309" />

                <rect x="4" y="14" width="12" height="2.5" rx="1" fill="#EF4444" />
                <circle cx="10" cy="17" r="1.5" fill="#FBBF24" />

                <circle cx="10" cy="7" r="9" fill="#B45309" stroke="#92400E" strokeWidth="0.5" />

                <motion.path
                  d="M2,2 C-2,1 -4,6 -3,11 C-2,14 1,14 1,10 C1,7 4,4 2,2"
                  fill="#78350F"
                  whileInView={{ rotate: [-5, 8, -5], y: [0, -1, 0] }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
                />

                <circle cx="8" cy="5" r="2" fill="#FFFFFF" />
                <circle cx="9.5" cy="5" r="1" fill="#000000" />

                <circle cx="14" cy="5" r="2" fill="#FFFFFF" />
                <circle cx="15.5" cy="5" r="1" fill="#000000" />

                <ellipse cx="13" cy="8.5" rx="3.5" ry="2.5" fill="#FFE4E6" opacity="0.95" />

                <circle cx="15.5" cy="7.5" r="1.2" fill="#1C1917" />

                <motion.path
                  d="M12.5,10 Q14,13.5 15,10 Z"
                  fill="#F43F5E"
                  whileInView={{ scaleY: [1, 1.4, 1] }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                />
              </g>

              <g transform="translate(18, 44)">
                <circle cx="0" cy="0" r="10" fill="#1F2937" />
                <circle cx="0" cy="0" r="6" fill="#E5E7EB" />
                <line x1="-5" y1="0" x2="5" y2="0" stroke="#9CA3AF" strokeWidth="1" />
                <line x1="0" y1="-5" x2="0" y2="5" stroke="#9CA3AF" strokeWidth="1" />
              </g>

              <g transform="translate(70, 44)">
                <circle cx="0" cy="0" r="10" fill="#1F2937" />
                <circle cx="0" cy="0" r="6" fill="#E5E7EB" />
                <line x1="-5" y1="0" x2="5" y2="0" stroke="#9CA3AF" strokeWidth="1" />
                <line x1="0" y1="-5" x2="0" y2="5" stroke="#9CA3AF" strokeWidth="1" />
              </g>

              <rect x="2" y="19" width="3" height="6" fill="#EF4444" rx="1.5" />

              <polygon points="80,20 100,16 100,38 80,24" fill="#FEF08A" opacity="0.32" />
              <circle cx="80" cy="22" r="2.5" fill="#FDE047" />
            </svg>
          </motion.div>
        </div>
        <p className="text-xs font-semibold text-stone-600 font-inter mt-1 whitespace-nowrap text-center">Доставим со скоростью виляния хвоста! 🍕🐾</p>
      </div>
    );
  }

  if (type === 'promotions-confetti') {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl overflow-hidden ${className}`} style={{ width, height }}>
        <div className="relative w-full h-full flex items-center justify-center">

          <motion.div
            className="absolute rounded-full bg-amber-400 w-3 h-3"
            whileInView={{ y: [0, -60, -100], x: [0, 40, 20], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.3] }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 3, delay: 0 }}
          />
          <motion.div
            className="absolute rounded-full bg-orange-400 w-2.5 h-2.5"
            whileInView={{ y: [20, -50, -80], x: [0, -30, -50], opacity: [0, 1, 0], scale: [0.4, 1.1, 0.4] }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
          />
          <motion.div
            className="absolute rounded-full bg-green-400 w-2 h-2"
            whileInView={{ y: [10, -70, -90], x: [10, 50, 70], opacity: [0, 1, 0], scale: [0.6, 1.3, 0.5] }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 2.8, delay: 1.2 }}
          />

          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            whileInView={{ rotate: 360 }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >

            <g transform="translate(25, 25) scale(0.6)" fill="#F97316" opacity="0.15">
              <circle cx="10" cy="14" r="5" />
              <circle cx="3" cy="7" r="3" />
              <circle cx="10" cy="4" r="3" />
              <circle cx="17" cy="7" r="3" />
            </g>
            <g transform="translate(80, 40) scale(0.5)" fill="#22C55E" opacity="0.15">
              <circle cx="10" cy="14" r="5" />
              <circle cx="3" cy="7" r="3" />
              <circle cx="10" cy="4" r="3" />
              <circle cx="17" cy="7" r="3" />
            </g>
            <g transform="translate(40, 75) scale(0.7)" fill="#F59E0B" opacity="0.15">
              <circle cx="10" cy="14" r="5" />
              <circle cx="3" cy="7" r="3" />
              <circle cx="10" cy="4" r="3" />
              <circle cx="17" cy="7" r="3" />
            </g>
          </motion.svg>

          <motion.div
            className="relative w-36 h-36 flex items-center justify-center"
            whileInView={{
              scale: [1, 1.05, 0.98, 1.03, 1],
              rotate: [0, -3, 3, -1, 0]
            }}
            viewport={VIEWPORT_ONCE}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 120 120" className="w-full h-full">

              <motion.path
                d="M60,10 L70,40 L100,50 L70,60 L60,90 L50,60 L20,50 L50,40 Z"
                fill="#FEF3C7"
                whileInView={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.8, 0.5] }}
                viewport={VIEWPORT_ONCE}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />

              <rect x="35" y="45" width="50" height="45" rx="5" fill="#FB923C" stroke="#F97316" strokeWidth="2" />

              <rect x="31" y="36" width="58" height="12" rx="3" fill="#F97316" stroke="#EA580C" strokeWidth="2" />

              <rect x="55" y="45" width="10" height="45" fill="#22C55E" />
              <rect x="55" y="36" width="10" height="12" fill="#22C55E" />

              <path d="M60,36 C54,18 42,28 55,36" fill="none" stroke="#22C55E" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M60,36 C66,18 78,28 65,36" fill="none" stroke="#22C55E" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="60" cy="36" r="4" fill="#16A34A" />

              <path d="M60,67 C60,67 56,62 53,60 Q50,57 53,54 Q56,51 60,56 Q64,51 67,54 Q70,57 67,60 Z" fill="#EF4444" />
            </svg>
          </motion.div>
        </div>
      </div>
    );
  }

  if (type === 'decor-paws') {
    return (
      <div className={`w-full flex justify-center items-center py-4 bg-orange-50/10 border-y border-orange-100/30 ${className}`} style={{ width, height }}>
        <div className="flex items-center justify-around w-full max-w-4xl px-4">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              whileInView={{
                y: [0, -8, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.95, 1.05, 0.95]
              }}
              viewport={VIEWPORT_ONCE}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: index * 0.4,
                ease: "easeInOut"
              }}
              className="flex items-center gap-2 select-none"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-orange-400 fill-current opacity-75">
                <circle cx="12" cy="14" r="4.5" />
                <circle cx="6" cy="7.5" r="3" />
                <circle cx="12" cy="5.5" r="3" />
                <circle cx="18" cy="7.5" r="3" />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'playing-pet-toys') {
    return (
      <div className={`w-full flex justify-center items-center py-4 bg-linear-to-r from-orange-50/10 via-orange-100/15 to-orange-50/10 border-y border-stone-100/60 ${className}`} style={{ width, height }}>
        <div className="flex flex-col items-center justify-center select-none relative w-full max-w-lg h-32 px-4">
          <svg viewBox="0 0 320 100" className="w-[300px] h-[95px]">

            <ellipse cx="140" cy="80" rx="60" ry="3" fill="#E2E8F0" opacity="0.6" />
            <ellipse cx="230" cy="81" rx="20" ry="2" fill="#E2E8F0" opacity="0.5" />

            <g transform="translate(40, 10)">

              <g transform="translate(56, 48)">
                <motion.g
                  whileInView={{ rotate: [-6, 12, -6] }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                >
                  <path
                    id="cat-tail"
                    d="M0,0 C-12,2 -18,-15 -28,-25 Q-32,-29 -26,-33 Q-20,-29 -14,-19 C-6,-7 -2,-2 0,0"
                    fill="#F97316"
                    stroke="#EA580C"
                    strokeWidth="0.5"
                  />

                  <path
                    d="M-28,-25 C-32,-29 -26,-33 -20,-29 C-22,-27 -25,-26 -28,-25"
                    fill="#FFF7ED"
                  />
                </motion.g>
              </g>

              <g id="resting-front-leg">
                <path d="M100,54 Q102,66 108,73" fill="none" stroke="#C2410C" strokeWidth="7.5" strokeLinecap="round" />
                <path d="M100,54 Q102,66 108,73" fill="none" stroke="#EA580C" strokeWidth="6" strokeLinecap="round" />
                <ellipse cx="108" cy="73" rx="5.5" ry="3.5" fill="#FFF7ED" stroke="#EA580C" strokeWidth="0.5" />
              </g>

              <g id="back-leg-group">

                <ellipse cx="58" cy="62" rx="13" ry="11" fill="#EA580C" stroke="#C2410C" strokeWidth="0.5" />

                <ellipse cx="68" cy="71" rx="9" ry="4.5" fill="#EA580C" stroke="#C2410C" strokeWidth="0.5" />

                <ellipse cx="73" cy="71" rx="5.5" ry="4" fill="#FFF7ED" stroke="#EA580C" strokeWidth="0.5" />

                <circle cx="76" cy="69" r="1.8" fill="#FFF7ED" />
                <circle cx="78" cy="72" r="1.8" fill="#FFF7ED" />
                <circle cx="75" cy="74" r="1.8" fill="#FFF7ED" />
              </g>

              <ellipse cx="85" cy="55" rx="34" ry="22" fill="#F97316" stroke="#EA580C" strokeWidth="0.5" />

              <ellipse cx="92" cy="58" rx="20" ry="12" fill="#FFF7ED" />

              <path d="M75,35 Q80,45 78,50" fill="none" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M85,34 Q90,44 88,50" fill="none" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M95,36 Q100,45 98,49" fill="none" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />

              <g transform="translate(108, 52)">
                <motion.g
                  whileInView={{ rotate: [-30, 15, 15, -30] }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.3, 0.45, 1], ease: "easeInOut" }}
                >

                  <path d="M0,0 Q18,6 26,0" fill="none" stroke="#F97316" strokeWidth="7" strokeLinecap="round" />

                  <circle cx="26" cy="0" r="5" fill="#FFF7ED" stroke="#EA580C" strokeWidth="0.5" />
                </motion.g>
              </g>

              <circle cx="125" cy="38" r="18" fill="#F97316" stroke="#EA580C" strokeWidth="0.5" />

              <ellipse cx="123" cy="44" rx="4.5" ry="3.5" fill="#FFF7ED" />
              <ellipse cx="129" cy="44" rx="4.5" ry="3.5" fill="#FFF7ED" />

              <polygon points="110,28 106,12 119,22" fill="#EA580C" />
              <polygon points="112,26 108,15 117,21" fill="#FCA5A5" />

              <polygon points="131,22 142,13 140,29" fill="#EA580C" />
              <polygon points="133,21 140,16 138,27" fill="#FCA5A5" />

              <path d="M114,35 Q119,32 122,36" fill="none" stroke="#431407" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M130,35 Q135,32 138,36" fill="none" stroke="#431407" strokeWidth="1.8" strokeLinecap="round" />

              <polygon points="124,41 128,41 126,43" fill="#F43F5E" />
              <path d="M123,45 Q126,48 128,45" fill="none" stroke="#431407" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M128,45 Q130,48 133,45" fill="none" stroke="#431407" strokeWidth="1.2" strokeLinecap="round" />

              <line x1="135" y1="44" x2="148" y2="42" stroke="#431407" strokeWidth="0.8" opacity="0.6" />
              <line x1="135" y1="46" x2="149" y2="47" stroke="#431407" strokeWidth="0.8" opacity="0.6" />
              <line x1="116" y1="44" x2="103" y2="42" stroke="#431407" strokeWidth="0.8" opacity="0.6" />
              <line x1="116" y1="46" x2="102" y2="47" stroke="#431407" strokeWidth="0.8" opacity="0.6" />
            </g>

            <motion.g
              whileInView={{
                x: [180, 180, 222, 180],
                y: [68, 68, 62, 68],
                rotate: [0, 0, 360, 0]
              }}
              viewport={VIEWPORT_ONCE}
              transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.3, 0.5, 1], ease: "easeInOut" }}
            >

              <circle cx="0" cy="0" r="14" fill="#0D9488" stroke="#0F766E" strokeWidth="1" />

              <path d="M-10,-5 C-5,-10 5,-10 10,-5 M-12,2 C-6,-5 6,-5 12,2 M-10,7 C-5,10 5,10 10,7" stroke="#0F766E" strokeWidth="1.2" fill="none" />
              <path d="M-8,-10 C-10,-5 -10,5 -8,10 M0,-14 C3,-7 3,7 0,14 M8,-10 C10,-5 10,5 8,10" stroke="#0D9488" strokeWidth="1" fill="none" />
            </motion.g>

            <motion.g
              whileInView={{ x: [265, 275, 265], y: [69, 71, 69] }}
              viewport={VIEWPORT_ONCE}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ellipse cx="0" cy="0" rx="6" ry="4" fill="#64748B" />
              <path d="M6,0 L12,1" stroke="#A8A29E" strokeWidth="1" /> {}
              <polygon points="-4,-3 -7,-5 -4,-1" fill="#94A3B8" /> {}
              <circle cx="-3" cy="-1" r="0.7" fill="#EF4444" /> {}
            </motion.g>

            <motion.g
              whileInView={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.9, 0.4] }}
              viewport={VIEWPORT_ONCE}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <text x="190" y="25" className="text-sm">🌟</text>
              <text x="145" y="15" className="text-xs">✨</text>
            </motion.g>
          </svg>
          <p className="text-xs text-stone-400 font-comfortaa font-medium animate-pulse">Котик резвится — выбирайте лучшие зоотовары! 🧶</p>
        </div>
      </div>
    );
  }

  return null;
}
