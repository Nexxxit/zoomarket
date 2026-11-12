import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';
import { getAllProducts } from '@/entities/product';
import { CartProvider } from '@/features/cart';
import { FavoritesProvider } from '@/features/favorites';
import { AuthProvider } from '@/features/auth';

const push = vi.hoisted(() => vi.fn());

vi.mock('next/image', async () => {
  const { createElement } = await vi.importActual<typeof import('react')>('react');
  return {
    default: (props: Record<string, unknown>) => createElement('img', props),
  };
});

vi.mock('next/navigation', () => ({
  usePathname: () => '/catalog',
  useRouter: () => ({ push }),
}));

function renderHeader() {
  return render(
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <Header />
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>,
  );
}

describe('Header interactivity', () => {
  beforeEach(() => {
    push.mockClear();
  });

  it('hamburger toggles the navbar mobile menu', async () => {
    const user = userEvent.setup();
    renderHeader();

    expect(screen.queryByText('Весь каталог')).toBeNull();
    const menuButton = screen.getByRole('button', { name: 'Меню каталога' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);
    expect(await screen.findByText('Весь каталог')).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('profile button opens AuthDrawer', async () => {
    const user = userEvent.setup();
    renderHeader();

    expect(screen.queryByText('Вход в Айболит')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Личный кабинет' }));
    expect(await screen.findByText('Вход в Айболит')).toBeInTheDocument();
  });

  it('search dropdown shows results, closes on Escape, handles no-match', async () => {
    const user = userEvent.setup();
    renderHeader();
    const input = screen.getByRole('textbox', { name: 'Поиск по каталогу' });

    await user.type(input, 'ownat');
    expect(await screen.findByText(/Найдено товаров: \d+/)).toBeInTheDocument();
    expect(screen.getByText(getAllProducts()[0].name)).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText(/Найдено товаров/)).toBeNull();

    await user.type(input, 'zzz9999неттакого');
    expect(await screen.findByText('Ничего не найдено')).toBeInTheDocument();
  });

  it('search Enter navigates to the catalog with ?search=', async () => {
    const user = userEvent.setup();
    renderHeader();
    const input = screen.getByRole('textbox', { name: 'Поиск по каталогу' });

    await user.type(input, 'ownat');
    await user.keyboard('{Enter}');

    expect(push).toHaveBeenCalledWith('/catalog?search=ownat');
  });

  it('"show all results" button navigates to the catalog with ?search=', async () => {
    const user = userEvent.setup();
    renderHeader();
    const input = screen.getByRole('textbox', { name: 'Поиск по каталогу' });

    await user.type(input, 'ownat');
    await user.click(await screen.findByRole('button', { name: 'Показать все результаты поиска' }));

    expect(push).toHaveBeenCalledWith('/catalog?search=ownat');
  });
});
