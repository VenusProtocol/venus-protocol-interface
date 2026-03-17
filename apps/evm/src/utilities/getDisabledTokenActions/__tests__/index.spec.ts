import type { Mock } from 'vitest';

import { usdc, xvs } from '__mocks__/models/tokens';

import { getDisabledTokenActions as getLocalDisabledTokenActions } from 'libs/tokens';
import { ChainId, type TokenAction } from 'types';

import { getDisabledTokenActions } from '..';

vi.mock('libs/tokens');

describe('getDisabledTokenActions', () => {
  const mockGetLocalDisabledTokenActions = getLocalDisabledTokenActions as Mock;

  beforeEach(() => {
    mockGetLocalDisabledTokenActions.mockReturnValue([]);
  });

  it('returns an empty list when no actions are paused or disabled locally', () => {
    const result = getDisabledTokenActions({
      bitmask: 0,
      chainId: ChainId.BSC_TESTNET,
      tokenAddresses: [],
    });

    expect(result).toEqual([]);
  });

  it('translates supported paused actions and ignores unsupported contract actions', () => {
    const result = getDisabledTokenActions({
      bitmask: 511, // 0b111111111
      chainId: ChainId.BSC_TESTNET,
      tokenAddresses: [],
    });

    expect(result).toEqual([
      'supply',
      'swapAndSupply',
      'withdraw',
      'borrow',
      'boost',
      'repay',
      'swapAndRepay',
      'enterMarket',
      'exitMarket',
    ]);
  });

  it('ignores bit positions that do not map to a contract action', () => {
    const result = getDisabledTokenActions({
      bitmask: 512, // 0b1000000000
      chainId: ChainId.BSC_TESTNET,
      tokenAddresses: [],
    });

    expect(result).toEqual([]);
  });

  it('merges local disabled actions across tokens and removes duplicates', () => {
    mockGetLocalDisabledTokenActions.mockImplementation(
      ({ tokenAddress }: { tokenAddress: string }): TokenAction[] => {
        if (tokenAddress === xvs.address) {
          return ['swapAndSupply', 'repay'];
        }

        if (tokenAddress === usdc.address) {
          return ['enterMarket', 'repay'];
        }

        return [];
      },
    );

    const result = getDisabledTokenActions({
      bitmask: 3, // 0b000000011 - MINT and REDEEM
      chainId: ChainId.BSC_TESTNET,
      tokenAddresses: [xvs.address, usdc.address],
    });

    expect(result).toEqual(['supply', 'swapAndSupply', 'withdraw', 'repay', 'enterMarket']);

    expect(mockGetLocalDisabledTokenActions).toHaveBeenNthCalledWith(1, {
      chainId: ChainId.BSC_TESTNET,
      tokenAddress: xvs.address,
    });
    expect(mockGetLocalDisabledTokenActions).toHaveBeenNthCalledWith(2, {
      chainId: ChainId.BSC_TESTNET,
      tokenAddress: usdc.address,
    });
  });
});
