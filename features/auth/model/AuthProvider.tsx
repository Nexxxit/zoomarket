'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UserAddress, UserProfile } from '@/entities/user';
import type { OrderSummary } from '@/entities/order';
import {
  login as loginRequest,
  logout as logoutRequest,
  fetchCurrentUser,
  fetchOrders,
  updateAddress as updateAddressRequest,
  removeAddress as removeAddressRequest,
} from '../api';
import type { AuthCredentials } from './types';
import { AuthApiError } from './types';
import {
  AuthActionsContext,
  AuthOrdersContext,
  AuthSessionContext,
  AuthStatusContext,
} from './authContext';
import type {
  AuthActionsValue,
  AuthOrdersValue,
  AuthSessionValue,
  AuthStatusValue,
} from './authContext';

const STORAGE_KEYS = {
  token: 'aibolit_auth_token',
  user: 'aibolit_auth_user',
} as const;

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error('Error reading localStorage', e);
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error('Error writing localStorage', e);
  }
}

function removeStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from localStorage', e);
  }
}

function isUnauthorized(e: unknown): boolean {
  // 401 от mock-api = сеанс мёртв: чиним локально, без «session error».
  return e instanceof AuthApiError && e.status === 401;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);

  // Рефы-зеркала сеанса: колбэки читают актуальные token/user через refs,
  // поэтому действия стабильны (deps []) и AuthActionsContext не «дёргает»
  // всё дерево на login/logout — по прецеденту CartProvider.
  const tokenRef = useRef<string | null>(null);
  const userRef = useRef<UserProfile | null>(null);
  // Актуальный id сеанса: PATCH адреса игнорирует ответ, если пользователь
  // сменился (logout/повторный вход) во время запроса.
  const activeUserIdRef = useRef<string | null>(null);
  const addressSavesRef = useRef(0);

  const commitSession = useCallback((nextToken: string | null, nextUser: UserProfile | null) => {
    tokenRef.current = nextToken;
    userRef.current = nextUser;
    activeUserIdRef.current = nextUser?.id ?? null;
    setUser(nextUser);
  }, []);

  const forceLocalLogout = useCallback(() => {
    commitSession(null, null);
    setOrders(null);
    removeStorage(STORAGE_KEYS.token);
    removeStorage(STORAGE_KEYS.user);
  }, [commitSession]);

  // Гидратация сеанса: из localStorage берём только токен, профиль (в т.ч.
  // role) — из ответа `GET /api/auth/me` (fetchCurrentUser). Нейтральный
  // storage-пользователь больше не источник истины. Эффект читает
  // синхронно (без setTimeout-тик): до завершения restore dependent UI
  // гейтится isHydrated — вспышки demo-состояния нет.
  useEffect(() => {
    let cancelled = false;
    const storedToken = readStorage(STORAGE_KEYS.token);
    if (!storedToken) {
      queueMicrotask(() => {
        if (!cancelled) setIsHydrated(true);
      });
      return () => {
        cancelled = true;
      };
    }
    fetchCurrentUser(storedToken)
      .then((profile) => {
        if (cancelled) return;
        commitSession(storedToken, profile);
        setIsHydrated(true);
      })
      .catch(() => {
        if (cancelled) return;
        removeStorage(STORAGE_KEYS.token);
        removeStorage(STORAGE_KEYS.user);
        setIsHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, [commitSession]);

  const userId = user?.id ?? null;

  // orders === null при залогиненном пользователе = «ещё не загружены»
  // (сбрасывается в login/logout), поэтому отдельный loading-стейт не нужен.
  const ordersLoading = userId !== null && orders === null;

  useEffect(() => {
    if (!userId) return;

    let active = true;
    fetchOrders(userId)
      .then((result) => {
        if (active) setOrders(result);
      })
      .catch(() => {
        if (active) setOrders([]);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const login = useCallback(async (credentials: AuthCredentials) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const session = await loginRequest(credentials);
      setOrders(null);
      commitSession(session.token, session.user);
      writeStorage(STORAGE_KEYS.token, session.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось войти. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  }, [commitSession]);

  const logout = useCallback(async () => {
    setError(null);
    setIsLoggingOut(true);
    try {
      await logoutRequest(tokenRef.current);
    } catch (e) {
      // 401 от mock-logout = выход уже состоялся на сервере — это успех.
      if (!isUnauthorized(e)) {
        setError('Не удалось выйти. Локальный сеанс всё равно сброшен.');
      }
    } finally {
      commitSession(null, null);
      setOrders(null);
      removeStorage(STORAGE_KEYS.token);
      removeStorage(STORAGE_KEYS.user);
      setIsLoggingOut(false);
    }
  }, [commitSession]);

  const updateAddress = useCallback(
    async (address: UserAddress): Promise<boolean> => {
      const currentUser = userRef.current;
      if (!currentUser) return false;
      const requestedUserId = currentUser.id;
      addressSavesRef.current += 1;
      setIsSavingAddress(true);
      setError(null);
      try {
        const updated = await updateAddressRequest(requestedUserId, address);
        // Сеанс мог смениться (logout/другой вход) во время запроса.
        if (activeUserIdRef.current !== requestedUserId) return false;
        commitSession(tokenRef.current, updated);
        return true;
      } catch (e) {
        if (activeUserIdRef.current === requestedUserId) {
          if (isUnauthorized(e)) {
            forceLocalLogout();
            setError('Сеанс истёк — войдите заново.');
          } else if (e instanceof Error) {
            setError(e.message);
          } else {
            setError('Не удалось сохранить адрес.');
          }
        }
        return false;
      } finally {
        addressSavesRef.current -= 1;
        if (addressSavesRef.current === 0) setIsSavingAddress(false);
      }
    },
    [commitSession, forceLocalLogout],
  );

  const clearAddress = useCallback(async (): Promise<boolean> => {
    const currentUser = userRef.current;
    if (!currentUser) return false;
    const requestedUserId = currentUser.id;
    addressSavesRef.current += 1;
    setIsSavingAddress(true);
    setError(null);
    try {
      const updated = await removeAddressRequest(requestedUserId);
      if (activeUserIdRef.current !== requestedUserId) return false;
      commitSession(tokenRef.current, updated);
      return true;
    } catch (e) {
      if (activeUserIdRef.current === requestedUserId) {
        if (isUnauthorized(e)) {
          forceLocalLogout();
          setError('Сеанс истёк — войдите заново.');
        } else if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Не удалось очистить адрес.');
        }
      }
      return false;
    } finally {
      addressSavesRef.current -= 1;
      if (addressSavesRef.current === 0) setIsSavingAddress(false);
    }
  }, [commitSession, forceLocalLogout]);

  const sessionValue = useMemo<AuthSessionValue>(
    () => ({ user, isHydrated }),
    [user, isHydrated],
  );

  // Заказы — отдельный контекст: их загрузка не перерисовывает потребителей
  // сеанса (Header и т.п.), подписан только drawer.
  const ordersValue = useMemo<AuthOrdersValue>(() => ({ orders }), [orders]);

  // commitSession/forceLocalLogout стабильны → actionsValue стабилен всегда.
  const actionsValue = useMemo<AuthActionsValue>(
    () => ({ login, logout, updateAddress, clearAddress }),
    [login, logout, updateAddress, clearAddress],
  );

  const statusValue = useMemo<AuthStatusValue>(
    () => ({ isSubmitting, isSavingAddress, isLoggingOut, ordersLoading, error }),
    [isSubmitting, isSavingAddress, isLoggingOut, ordersLoading, error],
  );

  return (
    <AuthSessionContext.Provider value={sessionValue}>
      <AuthOrdersContext.Provider value={ordersValue}>
        <AuthActionsContext.Provider value={actionsValue}>
          <AuthStatusContext.Provider value={statusValue}>
            {children}
          </AuthStatusContext.Provider>
        </AuthActionsContext.Provider>
      </AuthOrdersContext.Provider>
    </AuthSessionContext.Provider>
  );
}
