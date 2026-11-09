'use client';

import React from 'react';

export const HERO_AUTOPLAY_MS = 7000;
export const HERO_USER_HOLD_MS = 10000;

interface UseHeroAutoplayOptions {
  enabled: boolean;
  onAdvance: () => void;
  /** Интервал автопрокрутки, мс (по умолчанию HERO_AUTOPLAY_MS). */
  autoplayMs?: number;
}

export function useHeroAutoplay({ enabled, onAdvance, autoplayMs }: UseHeroAutoplayOptions) {
  const fillElRef = React.useRef<HTMLSpanElement | null>(null);
  const enabledRef = React.useRef(enabled);
  const onAdvanceRef = React.useRef(onAdvance);
  const holdingRef = React.useRef(false);
  const elapsedRef = React.useRef(0);
  const autoplayMsRef = React.useRef(autoplayMs ?? HERO_AUTOPLAY_MS);

  React.useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  React.useEffect(() => {
    onAdvanceRef.current = onAdvance;
  });

  React.useEffect(() => {
    autoplayMsRef.current = autoplayMs ?? HERO_AUTOPLAY_MS;
  }, [autoplayMs]);

  const applyFill = React.useCallback((ratio: number) => {
    const el = fillElRef.current;
    if (el) el.style.transform = `scaleX(${ratio})`;
  }, []);

  const attachFill = React.useCallback((el: HTMLSpanElement | null) => {
    if (!el) {
      // React detach callback. AnimatePresence: detach старого слайда приходит
      // ПОСЛЕ attach нового — сбрасываем ref, только если хранимый узел уже
      // отсоединён от DOM (иначе потеряли бы индикатор текущего слайда).
      const cur = fillElRef.current;
      if (cur && !cur.isConnected) fillElRef.current = null;
      return;
    }
    fillElRef.current = el;
    el.style.transform = 'scaleX(0)';
  }, []);

  const notifyManualSwitch = React.useCallback(() => {
    holdingRef.current = true;
    elapsedRef.current = 0;
    applyFill(0);
  }, [applyFill]);

  React.useEffect(() => {
    if (!enabled) {
      elapsedRef.current = 0;
      holdingRef.current = false;
    }
  }, [enabled]);

  React.useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = now - last;
      last = now;
      if (!enabledRef.current) return;

      elapsedRef.current += dt;
      const limit = holdingRef.current ? HERO_USER_HOLD_MS : autoplayMsRef.current;

      if (elapsedRef.current < limit) {
        applyFill(holdingRef.current ? 0 : elapsedRef.current / limit);
        return;
      }

      elapsedRef.current = 0;
      applyFill(0);
      if (holdingRef.current) {
        holdingRef.current = false;
        return;
      }
      onAdvanceRef.current();
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [applyFill]);

  return { attachFill, notifyManualSwitch };
}
