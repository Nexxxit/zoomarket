import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderForm } from '..';
import type { OrderFormSubmission, OrderFormSummary } from '..';
import { MOCK_DISTRICTS, PICKUP_STORES } from '@/shared/config/site';
import { DEFAULT_DELIVERY_INTERVAL } from '../model/deliveryIntervals';
import type { CartItem, CheckoutType } from '@/entities/cart';
import type { UserProfile } from '@/entities/user';

const cart: CartItem[] = [
  {
    id: '1',
    name: 'Корм для кошек Holistic',
    category: 'Корма',
    price: 1200,
    quantity: 2,
    imageType: 'food',
    size: '1.5 кг',
  },
];

const summary: OrderFormSummary = {
  cart,
  itemsSubtotal: 2400,
  deliveryCost: 300,
  promoDiscount: 0,
  grandTotal: 2700,
};

function renderCheckout({
  checkoutType = 'delivery',
  pickupAddress = PICKUP_STORES[0].address,
  user = null,
  onSelectPickupAddress = () => {},
  onSubmit = () => {},
}: {
  checkoutType?: CheckoutType;
  pickupAddress?: string;
  user?: UserProfile | null;
  onSelectPickupAddress?: (address: string) => void;
  onSubmit?: (values: OrderFormSubmission) => void;
} = {}) {
  return render(
    <OrderForm
      checkoutType={checkoutType}
      pickupAddress={pickupAddress}
      onSelectPickupAddress={onSelectPickupAddress}
      user={user}
      summary={summary}
      onSubmit={onSubmit}
    />,
  );
}

describe('OrderForm checkout mode', () => {
  it('accepts typing in every field instead of freezing it', async () => {
    const user = userEvent.setup();
    renderCheckout();

    const cases: Array<[RegExp, string]> = [
      [/^Ваше Имя/, 'Константин'],
      [/^Номер телефона/, '+79991234567'],
      [/^Электронная почта/, 'petlover@aibolit.ru'],
      [/^Улица/, 'Папина'],
      [/^Дом/, '7А'],
      [/^Квартира/, '5'],
      [/^Подъезд/, '2'],
      [/^Комментарий/, 'позвоните заранее'],
    ];

    for (const [label, text] of cases) {
      const field = screen.getByLabelText(label);
      await user.type(field, text);
      expect(field).toHaveValue(text);
    }
  });

  it('associates every label with its control', () => {
    renderCheckout();

    const labels = [
      /^Ваше Имя/, /^Номер телефона/, /^Электронная почта/, /^Улица/, /^Дом/,
      /^Квартира/, /^Подъезд/, /^Интервал доставки/, /^Комментарий/,
    ];

    for (const label of labels) {
      const field = screen.getByLabelText(label);
      const id = field.getAttribute('id');
      expect(id).toBeTruthy();
      expect(document.getElementById(id as string)).toBe(field);
    }
  });

  it('keeps the delivery interval in state', async () => {
    const user = userEvent.setup();
    renderCheckout();

    const select = screen.getByLabelText(/^Интервал доставки/);
    expect(select).toHaveValue(DEFAULT_DELIVERY_INTERVAL);

    await user.selectOptions(select, 'Завтра с 14:00 до 18:00');
    expect(select).toHaveValue('Завтра с 14:00 до 18:00');
  });

  it('renders the order summary sidebar', () => {
    renderCheckout();

    expect(screen.getByText('Ваш заказ')).toBeInTheDocument();
    expect(screen.getByText('2700 ₽')).toBeInTheDocument();
  });

  it('submits through onSubmit with the native navigation already prevented', () => {
    const onSubmit = vi.fn();
    const { container } = renderCheckout({ onSubmit });

    const submitButton = screen.getByRole('button', { name: /Подтвердить и заказать/ });
    expect(submitButton).toHaveAttribute('type', 'submit');

    const form = container.querySelector('form') as HTMLFormElement;
    expect(fireEvent.submit(form)).toBe(false);

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('emits the typed values and the pickup address on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { container } = renderCheckout({
      pickupAddress: PICKUP_STORES[1].address,
      onSubmit,
    });

    await user.type(screen.getByLabelText(/^Ваше Имя/), 'Анна');
    await user.type(screen.getByLabelText(/^Улица/), 'Тверская');
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Анна',
        street: 'Тверская',
        deliveryInterval: DEFAULT_DELIVERY_INTERVAL,
        pickupAddress: PICKUP_STORES[1].address,
      }),
    );
  });

  it('routes pickup store clicks through the handler', async () => {
    const user = userEvent.setup();
    const onSelectPickupAddress = vi.fn();
    renderCheckout({ checkoutType: 'pickup', onSelectPickupAddress });

    const target = PICKUP_STORES[1];
    const storeButton = screen
      .getAllByRole('button')
      .find((button) => button.textContent?.includes(target.address));

    expect(screen.queryByLabelText(/^Улица/)).not.toBeInTheDocument();
    expect(storeButton).toBeDefined();
    await user.click(storeButton as HTMLElement);
    expect(onSelectPickupAddress).toHaveBeenCalledWith(target.address);
  });

  it('prefills and locks contact fields for a signed-in user', () => {
    renderCheckout({
      user: {
        id: 'u-test-1',
        name: 'Мария',
        phone: '+79990000000',
        email: 'm@aibolit.ru',
        avatar: '',
        address: { street: 'ул. Мира', house: 'д. 7', flat: 'кв. 5', entrance: 'под. 2' },
        role: 'customer',
        registeredAt: '2025-01-01T00:00:00.000Z',
      },
    });

    const name = screen.getByLabelText(/^Ваше Имя/);
    expect(name).toHaveValue('Мария');
    expect(name).toBeDisabled();
    expect(screen.getByLabelText(/^Улица/)).toHaveValue('ул. Мира');
    expect(screen.getByLabelText(/^Дом/)).toHaveValue('д. 7');
    expect(screen.getByLabelText(/^Квартира/)).toHaveValue('кв. 5');
    expect(screen.getByLabelText(/^Подъезд/)).toHaveValue('под. 2');
  });
});

describe('OrderForm request mode', () => {
  function renderRequest(onSubmit = vi.fn()) {
    return {
      onSubmit,
      ...render(
        <OrderForm
          checkoutType="delivery"
          withDistrict
          withPetType
          submitLabel="Заказать бережную доставку"
          notice={<p>Безопасная бесконтактная передача</p>}
          onSubmit={onSubmit}
        />,
      ),
    };
  }

  it('renders district and pet selects, its own submit button and the notice', () => {
    renderRequest();

    expect(screen.getByLabelText(/^Район доставки/)).toHaveValue(MOCK_DISTRICTS[0].value);
    expect(screen.getByLabelText(/^Кто ждет подарок/)).toBeInTheDocument();
    expect(screen.getByText('Безопасная бесконтактная передача')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Заказать бережную доставку/ });
    expect(submitButton).toHaveAttribute('type', 'submit');

    expect(screen.queryByText('Ваш заказ')).not.toBeInTheDocument();
  });

  it('emits district and pet type values on submit', async () => {
    const user = userEvent.setup();
    const { onSubmit, container } = renderRequest();

    await user.selectOptions(screen.getByLabelText(/^Район доставки/), 'south');
    await user.type(screen.getByLabelText(/^Ваше Имя/), 'Игорь');
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Игорь',
        district: 'south',
        petType: expect.any(String),
        pickupAddress: '',
      }),
    );
  });
});
