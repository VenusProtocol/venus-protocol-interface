import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import spokePoolsResponse from '__mocks__/api/spokePools.json';
import spokePositionsResponse from '__mocks__/api/spokePositions.json';
import fakeAccountAddress from '__mocks__/models/address';
import { usdc, usdt } from '__mocks__/models/tokens';
import { ChainId } from 'types';
import { restService } from 'utilities';
import type { PublicClient } from 'viem';

import { getSpokePools } from '..';
import { getTokenBalances } from '../../getTokenBalances';

vi.mock('utilities/restService');
vi.mock('../../getTokenBalances');

const fakePublicClient = {} as PublicClient;

const mockResponses = ({ positions }: { positions: unknown }) =>
  (restService as Mock).mockImplementation(async ({ endpoint }: { endpoint: string }) => ({
    data: endpoint === '/spoke/pools' ? spokePoolsResponse : positions,
  }));

describe('getSpokePools', () => {
  beforeEach(() => {
    (getTokenBalances as Mock).mockImplementation(async () => ({
      tokenBalances: [{ token: usdc, balanceMantissa: new BigNumber('340000000') }],
    }));
  });

  it('formats pools and markets without an account', async () => {
    mockResponses({ positions: spokePositionsResponse });

    const { spokePools } = await getSpokePools({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdc, usdt],
      publicClient: fakePublicClient,
    });

    const [spokePool] = spokePools;
    const [collateral, loanAsset] = spokePool.assets;

    expect(spokePool.name).toBe('Hub-funded spoke');
    expect(collateral.isBorrowable).toBe(false);
    expect(collateral.isSuppliable).toBe(true);
    expect(collateral.supplyBalanceTokens.toFixed()).toBe('10000');
    expect(collateral.collateralFactor).toBe(0.8);
    expect(collateral.liquidationThresholdPercentage).toBe(88);
    expect(loanAsset.isBorrowable).toBe(true);
    expect(loanAsset.isSuppliable).toBe(false);
    expect(loanAsset.borrowBalanceTokens.toFixed()).toBe('2000');
    expect(loanAsset.borrowApyPercentage.toFixed()).toBe('4.55');
    expect(loanAsset.disabledTokenActions).toContain('borrow');
    expect(loanAsset.hubSupplyBalanceCents).toBeUndefined();
    expect(restService).toHaveBeenCalledTimes(1);
  });

  it('adds user balances and pool health when an account is passed', async () => {
    mockResponses({ positions: spokePositionsResponse });

    const { spokePools } = await getSpokePools({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdc, usdt],
      publicClient: fakePublicClient,
      accountAddress: fakeAccountAddress,
    });

    const [spokePool] = spokePools;
    const [collateral, loanAsset] = spokePool.assets;

    expect(collateral.userSupplyBalanceTokens.toFixed()).toBe('1000');
    expect(collateral.isCollateralOfUser).toBe(true);
    expect(collateral.userWalletBalanceTokens.toFixed()).toBe('340');
    expect(loanAsset.userBorrowBalanceTokens.toFixed()).toBe('100');
    expect(spokePool.userBorrowLimitCents?.toFixed()).toBe('80000');
    expect(spokePool.userLiquidationThresholdCents?.toFixed()).toBe('88000');
    expect(spokePool.userHealthFactor).toBe(8.8);
    expect(restService).toHaveBeenCalledWith({
      endpoint: '/spoke/positions',
      method: 'GET',
      params: { chainId: ChainId.BSC_TESTNET, account: fakeAccountAddress },
    });
  });

  it('throws when positions are unavailable', async () => {
    mockResponses({ positions: { error: 'No snapshot available' } });

    await expect(
      getSpokePools({
        chainId: ChainId.BSC_TESTNET,
        tokens: [usdc, usdt],
        publicClient: fakePublicClient,
        accountAddress: fakeAccountAddress,
      }),
    ).rejects.toThrow('somethingWentWrong');
  });

  it('skips markets whose underlying token is unknown', async () => {
    mockResponses({ positions: spokePositionsResponse });

    const { spokePools } = await getSpokePools({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdt],
      publicClient: fakePublicClient,
    });

    expect(spokePools[0].assets.map(asset => asset.vToken.underlyingToken.symbol)).toEqual([
      'USDT',
    ]);
  });
});
