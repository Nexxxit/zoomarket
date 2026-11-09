'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  itemContext: string;
  onDecrease: () => void;
  onIncrease: () => void;
}

export default function QuantityStepper({ value, itemContext, onDecrease, onIncrease }: QuantityStepperProps) {
  return (
    <div className="flex items-center bg-stone-50 p-1.5 border border-stone-200/80 rounded-full">
      <button
        type="button"
        aria-label={`Уменьшить количество: ${itemContext}`}
        onClick={onDecrease}
        className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-500 border border-stone-200/50 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-8 text-center text-xs font-bold text-stone-800 font-mono">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Увеличить количество: ${itemContext}`}
        onClick={onIncrease}
        className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-500 border border-stone-200/50 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
