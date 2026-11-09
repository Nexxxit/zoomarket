'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onSelect?: (value: number) => void;
  containerClassName?: string;
  buttonClassName?: string;
  starClassName?: string;

  ariaLabelTemplate?: string;
}

export default function StarRating({
  value,
  onSelect,
  containerClassName = 'flex items-center gap-1.5',
  buttonClassName = 'p-1 hover:scale-110 transition-transform cursor-pointer border-none bg-transparent',
  starClassName = 'w-8 h-8',
  ariaLabelTemplate,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const interactive = typeof onSelect === 'function';
  const displayValue = interactive && hoverValue !== null ? hoverValue : value;

  return (
    <div className={containerClassName} onMouseLeave={interactive ? () => setHoverValue(null) : undefined}>
      {[1, 2, 3, 4, 5].map((stars) => {
        const isLit = stars <= displayValue;
        return (
          <button
            key={stars}
            type="button"
            disabled={!interactive}
            onClick={interactive ? () => onSelect(stars) : undefined}
            onMouseEnter={interactive ? () => setHoverValue(stars) : undefined}
            className={buttonClassName}
            aria-label={ariaLabelTemplate ? ariaLabelTemplate.replace('${stars}', String(stars)) : `Оценить на ${stars}`}
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
