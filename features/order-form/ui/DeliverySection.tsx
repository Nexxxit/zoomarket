'use client';

import React, { useId } from 'react';
import { MOCK_DISTRICTS } from '@/shared/config/site';
import type { OrderFormKey, OrderFormValues } from '../model/types';
import { PET_TYPES } from '../model/petTypes';
import { DELIVERY_INTERVALS } from '../model/deliveryIntervals';
import StepHeading from './StepHeading';
import FormField from './FormField';
import TextField from './TextField';
import { SELECT } from './fieldStyles';

interface DeliverySectionProps {
  values: OrderFormValues;
  setField: (key: OrderFormKey, value: string) => void;
  withDistrict?: boolean;
  withPetType?: boolean;
}

export default function DeliverySection({
  values,
  setField,
  withDistrict = false,
  withPetType = false,
}: DeliverySectionProps) {
  const intervalId = useId();
  const districtId = useId();
  const petId = useId();

  return (
    <div className="space-y-5">
      <StepHeading step={2} title="Адрес и условия доставки" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TextField
          label="Улица *"
          className="md:col-span-2"
          type="text"
          required
          value={values.street}
          onChange={(value) => setField('street', value)}
          placeholder="ул. Александра Невского"
        />

        <TextField
          label="Дом *"
          type="text"
          required
          value={values.house}
          onChange={(value) => setField('house', value)}
          placeholder="д. 14Б"
        />

        <TextField
          label="Квартира / Офис"
          type="text"
          value={values.flat}
          onChange={(value) => setField('flat', value)}
          placeholder="кв. 102"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Подъезд / Домофон"
          type="text"
          value={values.entrance}
          onChange={(value) => setField('entrance', value)}
          placeholder="Подъезд 3, код 123"
        />

        <FormField label="Интервал доставки" htmlFor={intervalId}>
          <select
            id={intervalId}
            value={values.deliveryInterval}
            onChange={(e) => setField('deliveryInterval', e.target.value)}
            className={SELECT}
          >
            {DELIVERY_INTERVALS.map((interval) => (
              <option key={interval}>{interval}</option>
            ))}
          </select>
        </FormField>
      </div>

      {(withDistrict || withPetType) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {withDistrict && (
            <FormField label="Район доставки" htmlFor={districtId}>
              <select
                id={districtId}
                value={values.district}
                onChange={(e) => setField('district', e.target.value)}
                className={SELECT}
              >
                {MOCK_DISTRICTS.map((district) => (
                  <option key={district.value} value={district.value}>
                    {district.label}
                  </option>
                ))}
              </select>
            </FormField>
          )}

          {withPetType && (
            <FormField label="Кто ждет подарок в заказе?" htmlFor={petId}>
              <select
                id={petId}
                value={values.petType}
                onChange={(e) => setField('petType', e.target.value)}
                className={SELECT}
              >
                {PET_TYPES.map((pet) => (
                  <option key={pet}>{pet}</option>
                ))}
              </select>
            </FormField>
          )}
        </div>
      )}
    </div>
  );
}
