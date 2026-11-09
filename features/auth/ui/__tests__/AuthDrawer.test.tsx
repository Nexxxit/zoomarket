import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthDrawer from '../AuthDrawer';
import { AuthProvider } from '../../model/AuthProvider';

function renderDrawer() {
  return render(
    <AuthProvider>
      <AuthDrawer open />
    </AuthProvider>,
  );
}

async function loginAsDemo(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Ваше Имя/), 'Василий Иванович');
  await user.type(screen.getByLabelText(/^Номер телефона/), '+7 (999) 123-45-67');
  await user.click(screen.getByRole('button', { name: /Войти в личный кабинет/ }));
}

describe('AuthDrawer auth flow (mock API)', () => {
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

  it('logs out back to the login form', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await loginAsDemo(user);
    await screen.findByText('Заказ № 582914', undefined, { timeout: 3000 });

    await user.click(screen.getByRole('button', { name: /Выйти из аккаунта/ }));

    expect(await screen.findByText('Вход в Айболит', undefined, { timeout: 3000 })).toBeInTheDocument();
  });

  it('hydrates a legacy session whose address was a plain string', async () => {
    localStorage.setItem('aibolit_auth_token', 'mock-token-u-legacy');
    localStorage.setItem(
      'aibolit_auth_user',
      JSON.stringify({
        id: 'u-legacy',
        name: 'Старый Пользователь',
        phone: '+7 (999) 555-55-55',
        avatar: '🐹',
        address: 'ул. Мира',
        registeredAt: '2024-01-01T00:00:00.000Z',
      }),
    );

    renderDrawer();

    expect(await screen.findByText('ул. Мира', undefined, { timeout: 3000 })).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Изменить' }));
    expect(screen.getByLabelText(/^Улица/)).toHaveValue('ул. Мира');
    expect(screen.getByLabelText(/^Дом/)).toHaveValue('');
  });
});
