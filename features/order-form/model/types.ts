import type { ReactNode } from 'react';
import type { CartItem, CheckoutType } from '@/entities/cart';
import type { UserProfile } from '@/entities/user';

export interface OrderFormValues {
  name: string;
  phone: string;
  email: string;
  street: string;
  house: string;
  entrance: string;
  flat: string;
  deliveryInterval: string;
  comment: string;
  district: string;
  petType: string;
}

export type OrderFormKey = keyof OrderFormValues;

export interface OrderFormSubmission extends OrderFormValues {
  pickupAddress: string;
}

export interface OrderFormSummary {
  cart: CartItem[];
  itemsSubtotal: number;
  deliveryCost: number;
  promoDiscount: number;
  grandTotal: number;
}

interface OrderFormBaseProps {
  checkoutType: CheckoutType;
  user?: UserProfile | null;
  onSubmit: (values: OrderFormSubmission) => void;
}

export interface OrderFormCheckoutProps extends OrderFormBaseProps {
  summary: OrderFormSummary;
  pickupAddress: string;
  onSelectPickupAddress: (address: string) => void;
  withDistrict?: undefined;
  withPetType?: undefined;
  notice?: undefined;
  submitLabel?: undefined;
  className?: undefined;
}

export interface OrderFormStandaloneProps extends OrderFormBaseProps {
  summary?: undefined;
  pickupAddress?: undefined;
  onSelectPickupAddress?: undefined;
  withDistrict?: boolean;
  withPetType?: boolean;
  notice?: ReactNode;
  submitLabel?: string;
  className?: string;
}

export type OrderFormProps = OrderFormCheckoutProps | OrderFormStandaloneProps;
