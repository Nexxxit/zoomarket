'use client';

import React from 'react';
import { LottiePlayer } from '@/shared/ui';
import DeliveryBenefits from './DeliveryBenefits';
import DeliveryMetrics from './DeliveryMetrics';

export default function CourierPanel() {
  return (
    <section className="lg:col-span-5 space-y-6">

      <div className="h-72">
        <LottiePlayer type="courier-scooter" className="h-full w-full" />
      </div>

      <DeliveryBenefits />

      <DeliveryMetrics />

    </section>
  );
}
