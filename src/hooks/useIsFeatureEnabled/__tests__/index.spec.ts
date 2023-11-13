import { renderHook } from '@testing-library/react-hooks';
import { ChainId } from 'types';
import Vi from 'vitest';

import { useAuth } from 'context/AuthContext';

import { FeatureFlag, useIsFeatureEnabled } from '..';

vi.mock('context/AuthContext');
vi.unmock('hooks/useIsFeatureEnabled');

describe('useIsFeatureEnabled', () => {
  const routeFeatureFlags: FeatureFlag[] = [
    'corePoolRoute',
    'corePoolMarketRoute',
    'historyRoute',
    'convertVrtRoute',
    'swapRoute',
    'vaiRoute',
  ];

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

  it('should return all routes enabled on BSC_TESTNET', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    routeFeatureFlags.forEach(name => {
      const { result } = renderHook(() =>
        useIsFeatureEnabled({
          name,
        }),
      );

      expect(result.current).toBe(true);
    });
  });

  it('should return all routes enabled on BSC_MAINNET', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_MAINNET,
    }));

    routeFeatureFlags.forEach(name => {
      const { result } = renderHook(() =>
        useIsFeatureEnabled({
          name,
        }),
      );

      expect(result.current).toBe(true);
    });
  });

  it('should disable feature flagged routes on ETHEREUM', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.ETHEREUM,
    }));

    routeFeatureFlags.forEach(name => {
      const { result } = renderHook(() =>
        useIsFeatureEnabled({
          name,
        }),
      );

      expect(result.current).toBe(false);
    });
  });

  it('should disable feature flagged routes on SEPOLIA', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.SEPOLIA,
    }));

    routeFeatureFlags.forEach(name => {
      const { result } = renderHook(() =>
        useIsFeatureEnabled({
          name,
        }),
      );

      expect(result.current).toBe(false);
    });
  });

  it('should return true for creating proposals on BSC_TESTNET', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'createProposal',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return true for creating proposals on BSC_MAINNET', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_MAINNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'createProposal',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return false for creating proposals on ETHEREUM', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.ETHEREUM,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'createProposal',
      }),
    );

    expect(result.current).toBe(false);
  });

  it('should return false for creating proposals on SEPOLIA', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.SEPOLIA,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'createProposal',
      }),
    );

    expect(result.current).toBe(false);
  });

  it('should return true for voting proposals on BSC_MAINNET', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_MAINNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'voteProposal',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return false for voting proposals on BSC_TESTNET', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'voteProposal',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return false for voting proposals on ETHEREUM', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.SEPOLIA,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'voteProposal',
      }),
    );

    expect(result.current).toBe(false);
  });

  it('should return false for voting proposals on SEPOLIA', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.SEPOLIA,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'voteProposal',
      }),
    );

    expect(result.current).toBe(false);
  });
});
