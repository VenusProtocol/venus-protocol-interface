import { renderHook } from '@testing-library/react-hooks';
import { ChainId } from 'types';
import Vi from 'vitest';

import { useAuth } from 'context/AuthContext';

import { useIsFeatureEnabled } from '..';

vi.mock('context/AuthContext');
vi.unmock('hooks/useIsFeatureEnabled');

describe('useIsFeatureEnabled', () => {
  it('should return true for integratedSwap on BSC_TESTNET', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'integratedSwap',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return true for integratedSwap on BSC_MAINNET', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_MAINNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'integratedSwap',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return true for prime on BSC_TESTNET', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'prime',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return false for prime on BSC_MAINNET', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_MAINNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'prime',
      }),
    );

    expect(result.current).toBe(false);
  });
});
