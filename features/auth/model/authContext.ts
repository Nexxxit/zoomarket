import { createContext, useContext } from 'react';
import type { UserAddress, UserProfile } from '@/entities/user';
import type { OrderSummary } from '@/entities/order';
import type { AuthCredentials } from './types';

/** Сеанс: меняется редко (restore/login/logout/сохранение адреса). */
export interface AuthSessionValue {
  user: UserProfile | null;
  /** Гидрация из localStorage ещё не завершилась: dependent UI гейтится этим флагом. */
  isHydrated: boolean;
}

/** История заказов: грузится отдельно от сеанса, подписка — только у drawer. */
export interface AuthOrdersValue {
  orders: OrderSummary[] | null;
}

/** Стабильные колбэки: не пересоздаются при входе/выходе (refs вместо deps [token]/[user]). */
export interface AuthActionsValue {
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  /** Возвращает true, если адрес сохранён (успех `PATCH /api/user/address`). */
  updateAddress: (address: UserAddress) => Promise<boolean>;
  /** Возвращает true при успехе `DELETE /api/user/address`. */
  clearAddress: () => Promise<boolean>;
}

/** Статусы in-flight-запросов и ошибка: меняются часто, изолированы от дерева. */
export interface AuthStatusValue {
  /** Идёт запрос `POST /api/auth/login`. */
  isSubmitting: boolean;
  /** Идёт запрос `PATCH /api/user/address`. */
  isSavingAddress: boolean;
  /** Идёт запрос `POST /api/auth/logout`. */
  isLoggingOut: boolean;
  /** Идёт запрос `GET /api/user/orders`. */
  ordersLoading: boolean;
  error: string | null;
}

export type AuthContextValue = AuthSessionValue & AuthActionsValue & AuthStatusValue & AuthOrdersValue;

export const AuthSessionContext = createContext<AuthSessionValue | undefined>(undefined);
export const AuthActionsContext = createContext<AuthActionsValue | undefined>(undefined);
export const AuthStatusContext = createContext<AuthStatusValue | undefined>(undefined);
export const AuthOrdersContext = createContext<AuthOrdersValue | undefined>(undefined);

export function useAuthSession(): AuthSessionValue {
  const ctx = useContext(AuthSessionContext);
  if (ctx === undefined) {
    throw new Error('useAuthSession must be used within an AuthProvider');
  }
  return ctx;
}

export function useAuthOrders(): AuthOrdersValue {
  const ctx = useContext(AuthOrdersContext);
  if (ctx === undefined) {
    throw new Error('useAuthOrders must be used within an AuthProvider');
  }
  return ctx;
}

export function useAuthActions(): AuthActionsValue {
  const ctx = useContext(AuthActionsContext);
  if (ctx === undefined) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  return ctx;
}

export function useAuthStatus(): AuthStatusValue {
  const ctx = useContext(AuthStatusContext);
  if (ctx === undefined) {
    throw new Error('useAuthStatus must be used within an AuthProvider');
  }
  return ctx;
}

/** Полный срез (все контексты). Узким потребителям — useAuthSession/useAuthActions/useAuthStatus/useAuthOrders. */
export function useAuth(): AuthContextValue {
  return { ...useAuthSession(), ...useAuthOrders(), ...useAuthActions(), ...useAuthStatus() };
}
