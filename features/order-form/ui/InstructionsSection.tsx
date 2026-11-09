'use client';

import React, { useId } from 'react';
import { FileText } from 'lucide-react';
import type { OrderFormKey, OrderFormValues } from '../model/types';
import StepHeading from './StepHeading';
import FormField from './FormField';
import { TEXTAREA } from './fieldStyles';

interface InstructionsSectionProps {
  values: OrderFormValues;
  setField: (key: OrderFormKey, value: string) => void;
}

export default function InstructionsSection({ values, setField }: InstructionsSectionProps) {
  const id = useId();

  return (
    <div className="space-y-4">
      <StepHeading step={3} title="Дополнительные инструкции" />

      <FormField label="Комментарий к заказу" htmlFor={id} icon={FileText} iconAlign="top">
        <textarea
          id={id}
          rows={3}
          value={values.comment}
          onChange={(e) => setField('comment', e.target.value)}
          placeholder="Например: Пожалуйста, оставьте пакет у двери или позвоните за 30 минут до прибытия."
          className={TEXTAREA}
        />
      </FormField>
    </div>
  );
}
