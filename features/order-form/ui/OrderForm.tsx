'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MOCK_DISTRICTS } from '@/shared/config/site';
import type { OrderFormKey, OrderFormProps, OrderFormValues } from '../model/types';
import { DEFAULT_DELIVERY_INTERVAL } from '../model/deliveryIntervals';
import { PET_TYPES } from '../model/petTypes';
import ContactSection from './ContactSection';
import DeliverySection from './DeliverySection';
import InstructionsSection from './InstructionsSection';
import PickupStoresSection from './PickupStoresSection';
import CheckoutSummary from './CheckoutSummary';

const INITIAL_DISTRICT = MOCK_DISTRICTS[0]?.value ?? '';
const INITIAL_PET_TYPE = PET_TYPES[0] ?? '';

export default function OrderForm({
  checkoutType,
  pickupAddress = '',
  onSelectPickupAddress = () => {},
  user = null,
  summary,
  withDistrict = false,
  withPetType = false,
  notice,
  submitLabel = 'Отправить заявку',
  className,
  onSubmit,
}: OrderFormProps) {
  const [values, setValues] = useState<OrderFormValues>(() => ({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    house: user?.address?.house || '',
    entrance: user?.address?.entrance || '',
    flat: user?.address?.flat || '',
    deliveryInterval: DEFAULT_DELIVERY_INTERVAL,
    comment: '',
    district: INITIAL_DISTRICT,
    petType: INITIAL_PET_TYPE,
  }));

  const setField = (key: OrderFormKey, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ ...values, pickupAddress });
  };

  const sections = (
    <>
      <ContactSection values={values} setField={setField} user={user} />

      <div className="space-y-6 border-b border-stone-100 pb-8">
        {checkoutType === 'delivery' ? (
          <DeliverySection
            values={values}
            setField={setField}
            withDistrict={withDistrict}
            withPetType={withPetType}
          />
        ) : (
          <PickupStoresSection pickupAddress={pickupAddress} onSelectStore={onSelectPickupAddress} />
        )}
      </div>

      <InstructionsSection values={values} setField={setField} />
    </>
  );

  if (summary) {
    return (
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
        <div className="lg:col-span-8 bg-white border border-stone-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          {sections}
        </div>

        <CheckoutSummary
          cart={summary.cart}
          checkoutType={checkoutType}
          itemsSubtotal={summary.itemsSubtotal}
          deliveryCost={summary.deliveryCost}
          promoDiscount={summary.promoDiscount}
          grandTotal={summary.grandTotal}
        />
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${className ? `${className} ` : ''}bg-white rounded-3xl p-6 md:p-8 border border-stone-150 shadow-sm space-y-8`}
    >
      {sections}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold font-inter text-sm md:text-base rounded-full shadow-sm transition-colors text-center cursor-pointer"
      >
        {submitLabel}
      </motion.button>

      {notice}
    </form>
  );
}
