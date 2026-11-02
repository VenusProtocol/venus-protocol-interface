import { act } from '@testing-library/react';

import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';

import { useInterfaceMode } from '..';
import { useStore } from '../store';

vi.unmock('hooks/useIsFeatureEnabled');

describe('useInterfaceMode', () => {
  beforeEach(() => {
    act(() => useStore.getState().setMode('lite'));
  });

  it.each([ChainId.BSC_MAINNET, ChainId.BSC_TESTNET])('keeps Lite on chain %s', chainId => {
    const { result } = renderHook(() => useInterfaceMode(), { chainId });

    expect(result.current).toMatchObject({ mode: 'lite', isLite: true });
  });

  it.each([ChainId.ETHEREUM, ChainId.SEPOLIA, ChainId.ARBITRUM_ONE, ChainId.OPBNB_MAINNET])(
    'switches to Pro on chain %s',
    chainId => {
      const { result } = renderHook(() => useInterfaceMode(), { chainId });

      expect(result.current).toMatchObject({ mode: 'pro', isLite: false });
      expect(useStore.getState().mode).toBe('pro');
    },
  );
});
