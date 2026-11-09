import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFetch } from '../useFetch';

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as unknown as Response;
}

describe('useFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns isLoading true, then data on success', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ items: [1, 2] }));

    const { result } = renderHook(() => useFetch<{ items: number[] }>('/api/banners'));

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual({ items: [1, 2] });
    expect(result.current.error).toBeNull();
  });

  it('surfaces HTTP errors with status', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, false, 500));

    const { result } = renderHook(() => useFetch('/api/banners'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error?.message).toContain('500');
    expect(result.current.error?.status).toBe(500);
    expect(result.current.data).toBeNull();
  });

  it('does not fetch when url is null or skip is set', () => {
    renderHook(() => useFetch(null));
    renderHook(() => useFetch('/api/banners', { skip: true }));
    expect(fetch).not.toHaveBeenCalled();
  });

  it('refetch re-runs the request', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse('a'));

    const { result } = renderHook(() => useFetch<string>('/api/banners'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBe('a');

    vi.mocked(fetch).mockResolvedValue(jsonResponse('b'));
    act(() => result.current.refetch());
    await waitFor(() => expect(result.current.data).toBe('b'));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('keeps previous data while refetching, resets on url change', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse('one'));
    const { result, rerender } = renderHook(
      ({ url }: { url: string | null }) => useFetch<string>(url),
      { initialProps: { url: '/api/a' } },
    );
    await waitFor(() => expect(result.current.data).toBe('one'));

    vi.mocked(fetch).mockResolvedValue(jsonResponse('two'));
    act(() => result.current.refetch());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe('one');
    await waitFor(() => expect(result.current.data).toBe('two'));

    rerender({ url: '/api/b' });
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('aborts in-flight request on unmount (no state update)', async () => {
    let resolveFetch: (r: Response) => void = () => {};
    vi.mocked(fetch).mockImplementation(
      () => new Promise((resolve) => { resolveFetch = resolve; }),
    );

    const { result, unmount } = renderHook(() => useFetch<string>('/api/banners'));
    unmount();
    resolveFetch(jsonResponse('late'));
    await new Promise((r) => setTimeout(r));
    expect(result.current.data).toBeNull();
  });
});
