'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UserAddress, UserProfile } from '@/entities/user';
import type { OrderSummary } from '@/entities/order';
import {
  login as loginRequest,
  logout as logoutRequest,
  fetchOrders,
  updateAddress as updateAddressRequest,
} from '../api';
import type { AuthCredentials } from './types';
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

function normalizeStoredAddress(value: unknown): UserAddress | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? { street: trimmed, house: '' } : undefined;
  }
  if (value && typeof value === 'object') {
    const candidate = value as Partial<UserAddress>;
    if (typeof candidate.street === 'string') {
      return {
        street: candidate.street,
        house: typeof candidate.house === 'string' ? candidate.house : '',
        flat: typeof candidate.flat === 'string' ? candidate.flat : undefined,
        entrance:
          typeof candidate.entrance === 'string' ? candidate.entrance : undefined,
      };
    }
  }
  return undefined;
}

function parseStoredUser(raw: string | null): UserProfile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    if (
      parsed &&
      typeof parsed.id === 'string' &&
      typeof parsed.name === 'string' &&
      typeof parsed.phone === 'string'
    ) {
      return {
        id: parsed.id,
        name: parsed.name,
        phone: parsed.phone,
        email: parsed.email,
        avatar: parsed.avatar ?? '🐱',
        address: normalizeStoredAddress(parsed.address),
        role: parsed.role ?? 'customer',
        registeredAt: parsed.registeredAt ?? new Date().toISOString(),
      };
    }
  } catch (e) {
    console.error('Error parsing stored user', e);
  }
  return null;
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

  // Гидратация сеанса из localStorage. С реальным бэком здесь был бы
  // GET /api/auth/me с проверкой токена.
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedToken = readStorage(STORAGE_KEYS.token);
      const storedUser = parseStoredUser(readStorage(STORAGE_KEYS.user));
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    }, 0);
    return () => clearTimeout(timer);
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
      writeStorage(STORAGE_KEYS.user, JSON.stringify(session.user));
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
        writeStorage(STORAGE_KEYS.user, JSON.stringify(updated));
        return true;
      } catch (e) {
        if (activeUserIdRef.current === requestedUserId) {
          setError(e instanceof Error ? e.message : 'Не удалось сохранить адрес.');
        }
        return false;
      } finally {
        addressSavesRef.current -= 1;
        if (addressSavesRef.current === 0) setIsSavingAddress(false);
      }
    },
    [user],
  );

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
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
