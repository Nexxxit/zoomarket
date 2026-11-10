import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthDrawer from '../AuthDrawer';
import { AuthProvider } from '../../model/AuthProvider';
import { resetMockUserStore } from '../../api';

function renderDrawer(onClose = vi.fn()) {
  const result = render(
    <AuthProvider>
      <AuthDrawer open onClose={onClose} />
    </AuthProvider>,
  );
  return { ...result, onClose };
}

async function loginAsDemo(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Ваше Имя/), 'Василий Иванович');
  await user.type(screen.getByLabelText(/^Номер телефона/), '+7 (999) 123-45-67');
  await user.click(screen.getByRole('button', { name: /Войти в личный кабинет/ }));
}

describe('AuthDrawer auth flow (mock API)', () => {
  beforeEach(() => {
    resetMockUserStore();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the login form for an anonymous visitor', () => {
    renderDrawer();
    expect(screen.getByText('Вход в Айболит')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Электронная почта/)).toBeInTheDocument();
  });

  it('shows a validation error when the phone is too short', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await user.type(screen.getByLabelText(/^Ваше Имя/), 'Аноним');
    await user.type(screen.getByLabelText(/^Номер телефона/), '123');
    await user.click(screen.getByRole('button', { name: /Войти в личный кабинет/ }));

    expect(
      await screen.findByText(/Телефон должен содержать 11 цифр/, undefined, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Личный кабинет')).toBeNull();
  });

  it('exposes the panel as a modal dialog', () => {
    renderDrawer();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Вход в Айболит');
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const { onClose } = renderDrawer();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('locks background scroll while open and unlocks on close', () => {
    const { rerender } = render(
      <AuthProvider>
        <AuthDrawer open />
      </AuthProvider>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <AuthProvider>
        <AuthDrawer open={false} />
      </AuthProvider>,
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('logs in with the demo phone and shows profile with order history', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await loginAsDemo(user);

    expect(await screen.findByText('Личный кабинет', undefined, { timeout: 3000 })).toBeInTheDocument();
    expect(await screen.findByText('Заказ № 582914', undefined, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText('Доставлен ✅')).toBeInTheDocument();
    expect(screen.getByText('ул. Александра Невского, д. 14Б, кв. 102')).toBeInTheDocument();
  });

  it('updates the delivery address through the mock PATCH endpoint', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await loginAsDemo(user);
    await screen.findByText('Заказ № 582914', undefined, { timeout: 3000 });

    await user.click(screen.getByRole('button', { name: 'Изменить' }));
    const street = await screen.findByLabelText(/^Улица/);
    const house = screen.getByLabelText(/^Дом/);
    const flat = screen.getByLabelText(/Квартира/);
    await user.clear(street);
    await user.type(street, 'ул. Тверская');
    await user.clear(house);
    await user.type(house, 'д. 1');
    await user.clear(flat);
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(
      await screen.findByText('ул. Тверская, д. 1', undefined, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it('clears the delivery address through the mock DELETE endpoint', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await loginAsDemo(user);
    await screen.findByText('Заказ № 582914', undefined, { timeout: 3000 });

    await user.click(screen.getByRole('button', { name: 'Очистить адрес' }));

    expect(
      await screen.findByText(/Адрес не указан/, undefined, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it('logs out back to the login form', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await loginAsDemo(user);
    await screen.findByText('Заказ № 582914', undefined, { timeout: 3000 });

    await user.click(screen.getByRole('button', { name: /Выйти из аккаунта/ }));

    expect(await screen.findByText('Вход в Айболит', undefined, { timeout: 3000 })).toBeInTheDocument();
  });

  it('restores the session from GET /api/auth/me, not from stored user JSON', async () => {
    localStorage.setItem('aibolit_auth_token', 'mock-token-u-demo-1');
    localStorage.setItem(
      'aibolit_auth_user',
      JSON.stringify({
        id: 'u-demo-1',
        name: 'Подставное Имя',
        phone: '+7 (000) 000-00-00',
        avatar: '😈',
        role: 'admin',
        address: { street: 'ул. Хакера', house: '1' },
        registeredAt: '2024-01-01T00:00:00.000Z',
      }),
    );

    renderDrawer();

    expect(await screen.findByText('Личный кабинет', undefined, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText('Василий Иванович')).toBeInTheDocument();
    expect(screen.queryByText('Подставное Имя')).toBeNull();
    expect(screen.getByText('ул. Александра Невского, д. 14Б, кв. 102')).toBeInTheDocument();
    expect(screen.queryByText('ул. Хакера')).toBeNull();
  });

  it('drops a session whose token is unknown to the API', async () => {
    localStorage.setItem('aibolit_auth_token', 'mock-token-u-ghost');
    localStorage.setItem(
      'aibolit_auth_user',
      JSON.stringify({
        id: 'u-ghost',
        name: 'Призрак',
        phone: '+7 (999) 404-04-04',
        avatar: '👻',
        role: 'customer',
        registeredAt: '2024-01-01T00:00:00.000Z',
      }),
    );

    renderDrawer();

    expect(await screen.findByText('Вход в Айболит', undefined, { timeout: 3000 })).toBeInTheDocument();
    expect(localStorage.getItem('aibolit_auth_token')).toBeNull();
  });
});
