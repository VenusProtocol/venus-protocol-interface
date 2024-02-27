import Vi from 'vitest';

import { renderHook } from 'testUtils/render';

import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';

import { FeatureFlag, useIsFeatureEnabled } from '..';

vi.unmock('hooks/useIsFeatureEnabled');

describe('useIsFeatureEnabled', () => {
  const routeFeatureFlags: FeatureFlag[] = [
    'historyRoute',
    'convertVrtRoute',
    'swapRoute',
    'vaiRoute',
  ];

  it('should return true for integratedSwap on BSC_TESTNET', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'prime',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return true for prime on BSC_MAINNET', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_MAINNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'prime',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return all routes enabled on BSC_TESTNET', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
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
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.SEPOLIA,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'voteProposal',
      }),
    );

    expect(result.current).toBe(false);
  });

  it('should return true for the Prime calculator feature flag on BSC_MAINNET', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_MAINNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'primeCalculator',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return true for the Prime calculator feature flag on BSC_TESTNET', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'primeCalculator',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return true for the chain select feature flag on BSC_MAINNET', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_MAINNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'chainSelect',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return true for the chain select feature flag on ETHEREUM', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.ETHEREUM,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'chainSelect',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return false for the chain select feature flag on BSC_TESTNET', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'chainSelect',
      }),
    );

    expect(result.current).toBe(true);
  });

  it('should return false for the wrap/unwrap native token feature flag on ETHEREUM', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.ETHEREUM,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'wrapUnwrapNativeToken',
      }),
    );

    expect(result.current).toBe(false);
  });

  it('should return true for the wrap/unwrap native token feature flag on SEPOLIA', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.SEPOLIA,
    }));

    const { result } = renderHook(() =>
      useIsFeatureEnabled({
        name: 'wrapUnwrapNativeToken',
      }),
    );

    expect(result.current).toBe(true);
  });
});
