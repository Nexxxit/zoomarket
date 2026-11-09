'use client';

import { useId } from 'react';
import type { LucideIcon } from 'lucide-react';

interface AuthInputProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'tel' | 'email';
  placeholder?: string;
  required?: boolean;
}

export default function AuthInput({
  label,
  icon: Icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
}: AuthInputProps) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block"
      >
        {label} {required && '*'}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
          <Icon className="w-4 h-4" />
        </div>
        <input
          id={id}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-orange-500 focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
        />
      </div>
    </div>
  );
}
