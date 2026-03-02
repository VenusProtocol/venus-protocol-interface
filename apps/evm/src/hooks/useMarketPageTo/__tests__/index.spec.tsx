import { renderHook } from '@testing-library/react';
import type { Mock } from 'vitest';

import { useFormatTo } from 'hooks/useFormatTo';
import { TAB_PARAM_KEY } from 'hooks/useTabs';

import { useMarketPageTo } from '..';

vi.mock('hooks/useFormatTo');

describe('useMarketPageTo', () => {
  const poolComptrollerContractAddress = '0x1111111111111111111111111111111111111111';
  const vTokenAddress = '0x2222222222222222222222222222222222222222';

  it('returns the formatted market page route with the default tab', () => {
    const formattedTo = { pathname: '/formatted', search: '?tab=supply' };
    const mockFormatTo = vi.fn(() => formattedTo);

    (useFormatTo as Mock).mockImplementation(() => ({
      formatTo: mockFormatTo,
    }));

    const { result } = renderHook(() => useMarketPageTo());

    const marketPageTo = result.current.formatMarketPageTo({
      poolComptrollerContractAddress,
      vTokenAddress,
    });

    expect(mockFormatTo).toHaveBeenCalledWith({
      to: {
        pathname: `/markets/${poolComptrollerContractAddress}/${vTokenAddress}`,
        search: `${TAB_PARAM_KEY}=supply`,
      },
    });
    expect(marketPageTo).toBe(formattedTo);
  });

  it('returns the formatted market page route with the provided tab', () => {
    const formattedTo = { pathname: '/formatted', search: '?tab=borrow' };
    const mockFormatTo = vi.fn(() => formattedTo);

    (useFormatTo as Mock).mockImplementation(() => ({
      formatTo: mockFormatTo,
    }));

    const { result } = renderHook(() => useMarketPageTo());

    const marketPageTo = result.current.formatMarketPageTo({
      poolComptrollerContractAddress,
      vTokenAddress,
      tabId: 'borrow',
    });

    expect(mockFormatTo).toHaveBeenCalledWith({
      to: {
        pathname: `/markets/${poolComptrollerContractAddress}/${vTokenAddress}`,
        search: `${TAB_PARAM_KEY}=borrow`,
      },
    });
    expect(marketPageTo).toBe(formattedTo);
  });
});
