import React from 'react';
import Image from 'next/image';

export const renderPromoLogo = (className: string, size: number) => (
  <Image
    src="/logo_aibolit.jpg"
    alt=""
    width={size}
    height={size}
    className={`object-cover rounded-full opacity-90 ${className}`}
  />
);
