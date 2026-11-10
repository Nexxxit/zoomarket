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
import { AuthContext } from './authContext';
import type { AuthContextValue } from './authContext';

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
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);

  // Актуальный id сеанса: PATCH адреса игнорирует ответ, если пользователь
  // сменился (logout/повторный вход) во время запроса.
  const activeUserIdRef = useRef<string | null>(null);
  const addressSavesRef = useRef(0);

  const forceLocalLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    setOrders(null);
    removeStorage(STORAGE_KEYS.token);
    removeStorage(STORAGE_KEYS.user);
  }, []);

  // Гидратация сеанса: из localStorage берём только токен, профиль (в т.ч.
  // role) — из ответа `GET /api/auth/me` (fetchCurrentUser). Нейтральный
  // storage-пользователь больше не источник истины.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      const storedToken = readStorage(STORAGE_KEYS.token);
      if (!storedToken) return;
      fetchCurrentUser(storedToken)
        .then((profile) => {
          if (cancelled) return;
          setToken(storedToken);
          setUser(profile);
        })
        .catch(() => {
          if (cancelled) return;
          removeStorage(STORAGE_KEYS.token);
          removeStorage(STORAGE_KEYS.user);
        });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const userId = user?.id ?? null;

  useEffect(() => {
    activeUserIdRef.current = userId;
  }, [userId]);

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
      setToken(session.token);
      setUser(session.user);
      writeStorage(STORAGE_KEYS.token, session.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось войти. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    setIsLoggingOut(true);
    try {
      await logoutRequest(token);
    } catch (e) {
      // 401 от mock-logout = выход уже состоялся на сервере — это успех.
      if (!isUnauthorized(e)) {
        setError('Не удалось выйти. Локальный сеанс всё равно сброшен.');
      }
    } finally {
      setToken(null);
      setUser(null);
      setOrders(null);
      removeStorage(STORAGE_KEYS.token);
      removeStorage(STORAGE_KEYS.user);
      setIsLoggingOut(false);
    }
  }, [token]);

  const updateAddress = useCallback(
    async (address: UserAddress): Promise<boolean> => {
      if (!user) return false;
      const requestedUserId = user.id;
      addressSavesRef.current += 1;
      setIsSavingAddress(true);
      setError(null);
      try {
        const updated = await updateAddressRequest(requestedUserId, address);
        // Сеанс мог смениться (logout/другой вход) во время запроса.
        if (activeUserIdRef.current !== requestedUserId) return false;
        setUser(updated);
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
    [user, forceLocalLogout],
  );

  const clearAddress = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    const requestedUserId = user.id;
    addressSavesRef.current += 1;
    setIsSavingAddress(true);
    setError(null);
    try {
      const updated = await removeAddressRequest(requestedUserId);
      if (activeUserIdRef.current !== requestedUserId) return false;
      setUser(updated);
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
  }, [user, forceLocalLogout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isSubmitting,
      isSavingAddress,
      isLoggingOut,
      error,
      orders,
      ordersLoading,
      login,
      logout,
      updateAddress,
      clearAddress,
    }),
    [
      user,
      isSubmitting,
      isSavingAddress,
      isLoggingOut,
      error,
      orders,
      ordersLoading,
      login,
      logout,
      updateAddress,
      clearAddress,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
