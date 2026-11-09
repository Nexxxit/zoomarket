'use client';

import React, { useId } from 'react';
import type { LucideIcon } from 'lucide-react';
import FormField from './FormField';
import { ICON_INPUT, PLAIN_INPUT } from './fieldStyles';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'tel' | 'email';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export default function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  icon,
  className,
}: TextFieldProps) {
  const id = useId();

  return (
    <FormField label={label} htmlFor={id} icon={icon} className={className}>
      <input
        id={id}
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={icon ? ICON_INPUT : PLAIN_INPUT}
      />
    </FormField>
  );
}
