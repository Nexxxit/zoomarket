import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { createElement } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroCarousel from '../HeroCarousel';
import HeroCarouselProvider from '../HeroCarouselProvider';

const nav = vi.hoisted(() => ({ push: vi.fn(), search: '' }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: nav.push }),
  useSearchParams: () => new URLSearchParams(nav.search),
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => createElement('img', props),
}));

// Детерминированные часы: rAF вызывает кадры через мгновенный таймаут, а
// performance.now() идёт виртуальным шагом. pumpFrames прогоняет очередь
// кадров синхронно внутри act — автопрокрутка не зависит от wall-clock и
// нагрузки раннера (на полном суите macrotask-цепочка растягивалась).
let rafClock = 0;
let rafId = 0;
const rafPending = new Map<number, { timer: ReturnType<typeof setTimeout>; cb: FrameRequestCallback }>();

beforeEach(() => {
  rafClock = 0;
  rafId = 0;
  rafPending.clear();
  vi.spyOn(performance, 'now').mockImplementation(() => rafClock);
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = ++rafId;
    const timer = setTimeout(() => {
      rafPending.delete(id);
      rafClock += 16;
      cb(rafClock);
    }, 0);
    rafPending.set(id, { timer, cb });
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    const entry = rafPending.get(id);
    if (entry) {
      clearTimeout(entry.timer);
      rafPending.delete(id);
    }
  });
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  // prefers-reduced-motion: heroSlideDuration === 0, exit/enter завершаются за
  // кадр — под нагрузкой суита нельзя полагаться на wall-clock 0.65s анимации
  // (иначе старый слайд остаётся в DOM и getByRole видит два h1).
  vi.stubGlobal('matchMedia', (query: string) => ({
    media: query,
    matches: query.includes('prefers-reduced-motion'),
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  }));
});

afterEach(() => {
  rafPending.forEach(({ timer }) => clearTimeout(timer));
  rafPending.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function pumpFrames(count: number) {
  for (let i = 0; i < count; i++) {
    const batch = [...rafPending.values()];
    rafPending.clear();
    batch.forEach(({ timer }) => clearTimeout(timer));
    rafClock += 16;
    act(() => {
      batch.forEach(({ cb }) => cb(rafClock));
    });
  }
}

function activeHeadingText(): string {
  return screen.getByRole('heading', { level: 1 }).textContent ?? '';
}

describe('HeroCarousel', () => {
  it('auto-advances on catalog subpages, not only on /catalog home', async () => {
    // Короткий интервал, чтобы тест не зависел от wall-clock 7с под нагрузкой раннера.
    render(
      <HeroCarouselProvider autoplayMs={200}>
        <HeroCarousel />
      </HeroCarouselProvider>,
    );
    expect(activeHeadingText()).toContain('Grandin');

    // 13 кадров по 16мс > 200мс — автопрокрутка обязана сменить слайд;
    // ещё ~90 кадров дают exit/enter-анимации завершиться по виртуальным часам.
    pumpFrames(13);
    pumpFrames(90);

    await waitFor(
      () => {
        expect(activeHeadingText()).not.toContain('Grandin');
      },
      { timeout: 3000, interval: 25 },
    );
  }, 10000);

  it('shares one slide state across page switches: remount keeps the current slide', async () => {
    const user = userEvent.setup();

    const Tree = () => {
      const [page, setPage] = React.useState<'a' | 'b'>('a');
      return (
        <div>
          <button type="button" onClick={() => setPage((p) => (p === 'a' ? 'b' : 'a'))}>
            switch page
          </button>
          <HeroCarouselProvider>
            {/* HeroCarousel монтируется заново при смене страницы, провайдер — нет */}
            {page === 'a' ? <div data-testid="page-a"><HeroCarousel /></div> : null}
            {page === 'b' ? <div data-testid="page-b"><HeroCarousel /></div> : null}
          </HeroCarouselProvider>
        </div>
      );
    };

    render(<Tree />);
    expect(screen.getByTestId('page-a')).toBeInTheDocument();
    expect(activeHeadingText()).toContain('Grandin');

    await user.click(screen.getByRole('button', { name: 'Слайд 3' }));
    await waitFor(() => {
      expect(activeHeadingText()).toContain('паразитов');
    });

    await user.click(screen.getByRole('button', { name: 'switch page' }));

    expect(screen.queryByTestId('page-a')).toBeNull();
    expect(screen.getByTestId('page-b')).toBeInTheDocument();
    // Новый экземпляр (другая страница) показывает тот же слайд, а не первый.
    expect(activeHeadingText()).toContain('паразитов');
  }, 10000);
});
