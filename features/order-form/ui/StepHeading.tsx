'use client';

import React from 'react';

interface StepHeadingProps {
  step: number;
  title: string;
}

export default function StepHeading({ step, title }: StepHeadingProps) {
  return (
    <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-650 flex items-center justify-center text-xs font-bold font-mono">{step}</span>
      <span>{title}</span>
    </h2>
  );
}
