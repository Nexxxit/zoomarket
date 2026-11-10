import { createContext, useContext } from 'react';
import type { UserAddress, UserProfile } from '@/entities/user';
import type { OrderSummary } from '@/entities/order';
import type { AuthCredentials } from './types';

export interface AuthContextValue {
  user: UserProfile | null;
  /** Идёт запрос `POST /api/auth/login`. */
  isSubmitting: boolean;
  /** Идёт запрос `PATCH /api/user/address`. */
  isSavingAddress: boolean;
  /** Идёт запрос `POST /api/auth/logout`. */
  isLoggingOut: boolean;
  error: string | null;
  orders: OrderSummary[] | null;
  /** Идёт запрос `GET /api/user/orders`. */
  ordersLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  /** Возвращает true, если адрес сохранён (успех `PATCH /api/user/address`). */
  updateAddress: (address: UserAddress) => Promise<boolean>;
  /** Возвращает true при успехе `DELETE /api/user/address`. */
  clearAddress: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
