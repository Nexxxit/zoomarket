import type { UserProfile } from './types';

/**
 * Мок-«БД» пользователей для `POST /api/auth/login`: вход по номеру телефона.
 * Демо-вход: +7 (999) 123-45-67 — профиль с адресом и историей заказов.
 */
export const MOCK_USER_PROFILES: UserProfile[] = [
  {
    id: 'u-demo-1',
    name: 'Василий Иванович',
    phone: '+7 (999) 123-45-67',
    email: 'vasily@example.ru',
    avatar: '🐈',
    address: {
      street: 'ул. Александра Невского',
      house: 'д. 14Б',
      flat: 'кв. 102',
    },
    role: 'customer',
    registeredAt: '2025-03-12T10:00:00.000Z',
  },
  {
    id: 'u-demo-2',
    name: 'Мария Петрова',
    phone: '+7 (999) 000-00-02',
    avatar: '🐶',
    role: 'customer',
    registeredAt: '2026-01-05T08:30:00.000Z',
  },
];
