import React from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/cn';

export type ProductIconType = 'food' | 'toy' | 'medicine' | 'accessory';

interface ProductIconProps {
  type?: ProductIconType;
  className?: string;
  alt?: string;
}

export default function ProductIcon({ className, alt = '' }: ProductIconProps) {
  return (
    <Image
      src="/logo_aibolit.jpg"
      alt={alt}
      width={96}
      height={96}
      className={cn('w-24 h-24 object-cover rounded-full', className)}
    />
  );
}
