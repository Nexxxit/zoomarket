'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { FIELD_LABEL, ICON_WRAPPER_CENTER, ICON_WRAPPER_TOP } from './fieldStyles';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  icon?: LucideIcon;
  iconAlign?: 'center' | 'top';
  className?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  icon: Icon,
  iconAlign = 'center',
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={className ? `${className} space-y-1.5` : 'space-y-1.5'}>
      <label htmlFor={htmlFor} className={FIELD_LABEL}>
        {label}
      </label>
      {Icon ? (
        <div className="relative">
          <div className={iconAlign === 'top' ? ICON_WRAPPER_TOP : ICON_WRAPPER_CENTER}>
            <Icon className="w-4 h-4" />
          </div>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
