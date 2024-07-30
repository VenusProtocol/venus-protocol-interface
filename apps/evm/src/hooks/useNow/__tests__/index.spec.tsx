import { renderHook } from 'testUtils/render';

import { useNow } from '..';

const fakeNowMs = 1656603774000;

describe('useNow', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(fakeNowMs));
  });

  it('returns the current time, updated every minute', () => {
    const { result } = renderHook(() => useNow());

    expect(result.current.getTime()).toBe(fakeNowMs);

    vi.advanceTimersToNextTimer();

    expect(result.current.getTime()).toBe(fakeNowMs + 60000);
  });

  it('returns the current time, updated at an interval determined by the input', () => {
    const intervalMs = 1000;
    const { result } = renderHook(() => useNow({ intervalMs }));

    expect(result.current.getTime()).toBe(fakeNowMs);

    vi.advanceTimersToNextTimer();

    expect(result.current.getTime()).toBe(fakeNowMs + intervalMs);
  });
});
