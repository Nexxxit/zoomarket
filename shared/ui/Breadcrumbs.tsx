'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib';

export interface BreadcrumbItem {
  label: string;
  /** Целевые сегменты навигации; без них (или без onNavigate) крошка рендерится некликабельной */
  segments?: string[];
  className?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (segments: string[]) => void;
  /** aria-label для <nav> */
  label?: string;
  className?: string;
}

interface CrumbProps {
  label: string;
  active: boolean;
  onClick?: () => void;
  className?: string;
}

function Crumb({ label, active, onClick, className }: CrumbProps) {
  if (active || !onClick) {
    return (
      <span
        className={cn('font-bold text-orange-500', className)}
        aria-current={active ? 'page' : undefined}
      >
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'font-bold hover:text-orange-500 bg-transparent border-none p-0 cursor-pointer',
        className
      )}
    >
      {label}
    </button>
  );
}

/** Generic presentational breadcrumbs: последний item активен (aria-current="page", не кликабелен), остальные ведут на свой уровень через onNavigate(item.segments). */
export default function Breadcrumbs({
  items,
  onNavigate,
  label = 'Хлебные крошки',
  className,
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const lastIndex = items.length - 1;

  return (
    <nav aria-label={label} className={cn('w-fit', className)}>
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500 font-comfortaa bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 w-fit list-none m-0">
        {items.map((item, index) => {
          const { label: itemLabel, segments, className: itemClassName } = item;
          const isLast = index === lastIndex;
          const onClick = !isLast && segments && onNavigate
            ? () => onNavigate(segments)
            : undefined;

          return (
            <li key={`${index}-${itemLabel}`} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-400" aria-hidden />}
              <Crumb
                label={itemLabel}
                active={isLast}
                onClick={onClick}
                className={itemClassName}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
