'use client';

import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  variant?: 'primary' | 'outline';
}

const buttonStyles: Record<'primary' | 'outline', string> = {
  primary: 'px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/10',
  outline: 'px-5 py-2 border-2 border-stone-900 hover:bg-stone-900 hover:text-white',
};

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'primary',
}: EmptyStateProps) {
  return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4">
      <span className="text-4xl" aria-hidden="true">{icon}</span>
      <h3 className="text-lg font-bold font-comfortaa text-stone-900">{title}</h3>
      <p className="text-xs text-stone-500 leading-normal">{description}</p>
      <button
        type="button"
        onClick={onAction}
        className={`font-bold font-comfortaa rounded-full text-xs transition-all cursor-pointer ${buttonStyles[variant]}`}
      >
        {actionLabel}
      </button>
    </div>
  );
}
