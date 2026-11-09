import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

const updateAddress = vi.fn().mockResolvedValue(true);
let submitOrder: ((values: Record<string, unknown>) => void) | null = null;

const mockUser = {
  id: 'u-1',
  name: 'Мария',
  phone: '+79990000000',
  avatar: '🐶',
  role: 'customer',
  registeredAt: '2025-01-01T00:00:00.000Z',
  address: undefined as undefined | Record<string, unknown>,
};

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

vi.mock('next/link', () => ({
  default: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('@/features/auth', () => ({
  useAuth: () => ({ user: mockUser, updateAddress }),
}));

vi.mock('@/features/cart', () => ({
  useCart: () => ({
    cart: [
      {
        id: '1',
        name: 'Корм',
        category: 'Корма',
        price: 1000,
        quantity: 1,
        imageType: 'food',
        size: '1 кг',
      },
    ],
    checkoutType: 'delivery',
    pickupAddress: '',
    setPickupAddress: vi.fn(),
    clearCart: vi.fn(),
    clearPromo: vi.fn(),
    promoCode: null,
  }),
}));

vi.mock('@/entities/cart', () => ({
  selectSubtotal: () => 1000,
  selectDeliveryCost: () => 0,
  selectPromoDiscount: () => 0,
  selectGrandTotal: () => 1000,
}));

vi.mock('@/features/order-form', () => ({
  OrderForm: ({ onSubmit }: { onSubmit: (values: Record<string, unknown>) => void }) => {
    submitOrder = onSubmit;
    return <div>mock-order-form</div>;
  },
}));

vi.mock('../_components/OrderSuccess', () => ({
  default: () => <div>mock-order-success</div>,
}));

import CheckoutPage from '../page';

function fillDeliveryAddress(overrides: Record<string, string> = {}) {
  return {
    name: 'Мария',
    phone: '+79990000000',
    email: '',
    street: 'ул. Мира',
    house: '7',
    entrance: '',
    flat: '',
    deliveryInterval: 'Сегодня 18:00–20:00',
    comment: '',
    district: 'central',
    petType: 'Кошка',
    pickupAddress: '',
    ...overrides,
  };
}

describe('checkout address sync', () => {
  beforeEach(() => {
    updateAddress.mockClear();
    submitOrder = null;
    mockUser.address = undefined;
  });

  it('saves the delivery address to the profile after the order', async () => {
    render(<CheckoutPage />);

    submitOrder!(fillDeliveryAddress());

    await waitFor(() =>
      expect(updateAddress).toHaveBeenCalledWith({
        street: 'ул. Мира',
        house: '7',
        flat: undefined,
        entrance: undefined,
      }),
    );
  });

  it('does not save when street or house is missing', async () => {
    render(<CheckoutPage />);

    submitOrder!(fillDeliveryAddress({ house: '  ' }));

    await new Promise((r) => setTimeout(r, 50));
    expect(updateAddress).not.toHaveBeenCalled();
  });

  it('skips the request when the profile already has this address', async () => {
    mockUser.address = { street: 'ул. Мира', house: '7' };
    render(<CheckoutPage />);

    submitOrder!(fillDeliveryAddress());

    await new Promise((r) => setTimeout(r, 50));
    expect(updateAddress).not.toHaveBeenCalled();
  });

  it('saves the changed flat and entrance over the stored ones', async () => {
    mockUser.address = { street: 'ул. Мира', house: '7', flat: 'кв. 1' };
    render(<CheckoutPage />);

    submitOrder!(fillDeliveryAddress({ flat: 'кв. 5', entrance: 'под. 2' }));

    await waitFor(() =>
      expect(updateAddress).toHaveBeenCalledWith({
        street: 'ул. Мира',
        house: '7',
        flat: 'кв. 5',
        entrance: 'под. 2',
      }),
    );
  });
});
