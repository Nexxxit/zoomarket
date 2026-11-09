'use client';

import React from 'react';
import { User, Phone, Mail } from 'lucide-react';
import type { UserProfile } from '@/entities/user';
import type { OrderFormKey, OrderFormValues } from '../model/types';
import StepHeading from './StepHeading';
import TextField from './TextField';

interface ContactSectionProps {
  values: OrderFormValues;
  setField: (key: OrderFormKey, value: string) => void;
  user: UserProfile | null;
}

export default function ContactSection({ values, setField, user }: ContactSectionProps) {
  return (
    <div className="space-y-5 border-b border-stone-100 pb-8">
      <StepHeading step={1} title="Контактные данные получателя" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Ваше Имя *"
          icon={User}
          type="text"
          required
          disabled={!!user}
          value={values.name}
          onChange={(value) => setField('name', value)}
          placeholder="Константин Константинопольский"
        />

        <TextField
          label="Номер телефона *"
          icon={Phone}
          type="tel"
          required
          disabled={!!user}
          value={values.phone}
          onChange={(value) => setField('phone', value)}
          placeholder="+7 (999) 123-45-67"
        />
      </div>

      <TextField
        label="Электронная почта (для чека)"
        icon={Mail}
        type="email"
        disabled={!!user}
        value={values.email}
        onChange={(value) => setField('email', value)}
        placeholder="petlover@aibolit.ru"
      />
    </div>
  );
}
