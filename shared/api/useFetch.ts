'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseFetchOptions extends Omit<RequestInit, 'signal'> {
  skip?: boolean;
}

export type FetchError = Error & { status?: number };

export interface UseFetchResult<T> {
  data: T | null;
  error: FetchError | null;
  isLoading: boolean;
  refetch: () => void;
}

interface SettledRequest<T> {
  url: string;
  nonce: number;
  data: T | null;
  error: FetchError | null;
}

export function useFetch<T>(url: string | null, options: UseFetchOptions = {}): UseFetchResult<T> {
  const { skip = false, ...init } = options;

  const [nonce, setNonce] = useState(0);
  const [settled, setSettled] = useState<SettledRequest<T> | null>(null);

  const initRef = useRef(init);
  useEffect(() => {
    initRef.current = init;
  });

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!url || skip) return;

    const controller = new AbortController();
    const requestNonce = nonce;
    let active = true;

    (async () => {
      try {
        const response = await fetch(url, { ...initRef.current, signal: controller.signal });
        if (!response.ok) {
          throw Object.assign(
            new Error(`Request failed with status ${response.status}`),
            { status: response.status },
          );
        }
        const json = (await response.json()) as T;
        if (active) setSettled({ url, nonce: requestNonce, data: json, error: null });
      } catch (e) {
        if (active && (e as Error).name !== 'AbortError') {
          setSettled({ url, nonce: requestNonce, data: null, error: e as FetchError });
        }
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [url, skip, nonce]);

  const forThisUrl = settled !== null && url !== null && settled.url === url;
  const fresh = forThisUrl && settled !== null && settled.nonce === nonce;

  return {
    data: forThisUrl ? settled.data : null,
    error: forThisUrl ? settled.error : null,
    isLoading: Boolean(url) && !skip && !fresh,
    refetch,
  };
}
