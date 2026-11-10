import { describe, it, expect } from 'vitest';
import { getPromo, PROMO_CODES } from '../commerce';

describe('getPromo', () => {
  it('returns the share for known codes', () => {
    expect(getPromo('AIBOLIT10')).toBe(0.1);
    expect(getPromo('LOVEPETS')).toBe(0.15);
  });

  it('returns undefined for unknown codes', () => {
    expect(getPromo('NOPE')).toBeUndefined();
    expect(getPromo('')).toBeUndefined();
    expect(getPromo('aibolit10')).toBeUndefined();
  });

  it('never hits prototype keys (`code in PROMO_CODES` gave false positives)', () => {
    expect(getPromo('constructor')).toBeUndefined();
    expect(getPromo('toString')).toBeUndefined();
    expect(getPromo('valueOf')).toBeUndefined();
    expect(getPromo('__proto__')).toBeUndefined();
    expect(getPromo('hasOwnProperty')).toBeUndefined();
  });

  it('is consistent with PROMO_CODES content', () => {
    Object.keys(PROMO_CODES).forEach((code) => {
      expect(getPromo(code)).toBe(PROMO_CODES[code]);
    });
  });
});
