import noop from 'noop-ts';
import type { Mock } from 'vitest';

import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { renderHook } from 'testUtils/render';
import { useGetUserSlippageTolerance } from '..';

vi.mock('hooks/useUserChainSettings', () => ({
  useUserChainSettings: vi.fn(() => [
    {
      slippageTolerancePercentage: 1,
    },
    noop,
  ]),
}));

describe('useGetUserSlippageTolerance', () => {
  it('returns the correct value', () => {
    const { result } = renderHook(() => useGetUserSlippageTolerance());

    expect(result.current.userSlippageTolerancePercentage).toEqual(1);
  });

  it('returns default value if user setting is undefined', () => {
    (useUserChainSettings as Mock).mockImplementation(() => [{}, noop]);

    const { result } = renderHook(() => useGetUserSlippageTolerance());

    expect(result.current.userSlippageTolerancePercentage).toEqual(
      DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
    );
  });
});
