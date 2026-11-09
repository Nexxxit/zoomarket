import type { UserProfile } from '@/entities/user';

/** Тело запроса `POST /api/auth/login` — уходит на бэк. */
export interface AuthCredentials {
  name: string;
  phone: string;
  email?: string;
}

/** Ответ `POST /api/auth/login` (200) — приходит с бэка. */
export interface AuthSession {
  token: string;
  user: UserProfile;
}

/** Ошибка бэка: `{ message }` с HTTP-статусом (400/404/429...). */
export class AuthApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}
