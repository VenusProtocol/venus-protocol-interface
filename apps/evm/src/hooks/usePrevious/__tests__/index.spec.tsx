import { renderHook } from 'testUtils/render';

import { usePrevious } from '..';

describe('usePrevious', () => {
  it('returns undefined on initial render', () => {
    const { result } = renderHook(() => usePrevious('current value'));

    expect(result.current).toBeUndefined();
  });

  it('returns the previous value after rerenders', () => {
    let value = 1;
    const { result, rerender } = renderHook(() => usePrevious(value));

    expect(result.current).toBeUndefined();

    value = 2;
    rerender();

    expect(result.current).toBe(1);

    value = 3;
    rerender();

    expect(result.current).toBe(2);
  });
});
