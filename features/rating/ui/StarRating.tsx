'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  containerClassName?: string;
  buttonClassName?: string;
  starClassName?: string;

  ariaLabelTemplate?: string;
}

export default function StarRating({
  value,
  containerClassName = 'flex items-center gap-1.5',
  buttonClassName = 'p-1 hover:scale-110 transition-transform cursor-pointer border-none bg-transparent',
  starClassName = 'w-8 h-8',
  ariaLabelTemplate,
}: StarRatingProps) {
  return (
    <div className={containerClassName}>
      {[1, 2, 3, 4, 5].map((stars) => {
        const isLit = stars <= value;
        return (
          <button
            key={stars}
            type="button"
            className={buttonClassName}
            aria-label={ariaLabelTemplate ? ariaLabelTemplate.replace('${stars}', String(stars)) : undefined}
          >
            <Star
              className={`${starClassName} ${isLit ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
}
