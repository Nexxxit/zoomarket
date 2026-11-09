import type { UserAddress, UserProfile } from '@/entities/user';
import { isAddressComplete } from '@/entities/user';
import { MOCK_USER_PROFILES } from '@/entities/user';
import type { OrderSummary } from '@/entities/order';
import { MOCK_ORDERS } from '@/entities/order';
import type { AuthCredentials, AuthSession } from '../model/types';
import { AuthApiError } from '../model/types';

/**
 * Мок-слой авторизации. Каждая функция описывает один эндпоинт; контракты
 * запросов/ответов рассчитаны так, что замена на реальные вызовы
 * (см. shared/api/useFetch или обёртку fetch) не меняет компоненты:
 *
 * - POST  /api/auth/login        → { name, phone, email? }
 *   200: { token, user } | 400: { message }
 * - POST  /api/auth/logout       → без тела, Authorization: Bearer <token>; 204
 * - GET   /api/auth/me           → по токену возвращает UserProfile
 *   (мок восстанавливает профиль из localStorage)
 * - GET   /api/user/orders       → OrderSummary[]
 * - PATCH /api/user/address      → { address } → обновлённый UserProfile
 */

const MOCK_LATENCY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/** Мок-«БД»: mutable, чтобы PATCH адреса переживал перезапросы в сессии. */
let mockUserStore: UserProfile[] = MOCK_USER_PROFILES.map((user) => ({ ...user }));

/** `POST /api/auth/login`: ищет пользователя по телефону, иначе создаёт нового. */
export async function login(credentials: AuthCredentials): Promise<AuthSession> {
  await delay(MOCK_LATENCY_MS);

  const name = credentials.name.trim();
  const phone = credentials.phone.trim();
  const digits = normalizePhone(phone);

  if (!name) {
    throw new AuthApiError(400, 'Укажите имя — так курьер будет знать, к кому приехать.');
  }
  if (digits.length !== 11) {
    throw new AuthApiError(400, 'Телефон должен содержать 11 цифр, например +7 (999) 123-45-67.');
  }

  let user = mockUserStore.find((candidate) => normalizePhone(candidate.phone) === digits);

  if (!user) {
    user = {
      id: `u-${Date.now()}`,
      name,
      phone,
      email: credentials.email?.trim() || undefined,
      avatar: '🐱',
      role: 'customer',
      registeredAt: new Date().toISOString(),
    };
    mockUserStore = [...mockUserStore, user];
  } else if (user.name !== name) {
    user = { ...user, name };
    mockUserStore = mockUserStore.map((candidate) =>
      candidate.id === user!.id ? user! : candidate,
    );
  }

  return {
    token: `mock-token-${user.id}`,
    user: { ...user },
  };
}

/** `POST /api/auth/logout` (Authorization: Bearer <token>) → 204. */
export async function logout(token: string | null): Promise<void> {
  await delay(MOCK_LATENCY_MS);
  if (!token) {
    throw new AuthApiError(401, 'Сессия не найдена — войдите заново.');
  }
}

/** `GET /api/user/orders` — заказы текущего пользователя, новые сверху. */
export async function fetchOrders(userId: string): Promise<OrderSummary[]> {
  await delay(MOCK_LATENCY_MS);
  return MOCK_ORDERS.filter((order) => order.userId === userId);
}

/** `PATCH /api/user/address`: { address } → обновлённый UserProfile. */
export async function updateAddress(userId: string, address: UserAddress): Promise<UserProfile> {
  await delay(MOCK_LATENCY_MS);

  if (!isAddressComplete(address)) {
    throw new AuthApiError(400, 'Заполните улицу и дом — курьеру нужен точный адрес.');
  }

  const index = mockUserStore.findIndex((user) => user.id === userId);
  if (index === -1) {
    throw new AuthApiError(404, 'Пользователь не найден.');
  }

  const normalized: UserAddress = {
    street: address.street.trim(),
    house: address.house.trim(),
    flat: address.flat?.trim() || undefined,
    entrance: address.entrance?.trim() || undefined,
  };

  const updated: UserProfile = { ...mockUserStore[index], address: normalized };
  mockUserStore = mockUserStore.map((user, i) => (i === index ? updated : user));

  return { ...updated };
}
