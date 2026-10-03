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

const fakePoolLensContractAddress = '0x00000000000000000000000000000000000000a1';

const [fixtureAccountPool] = spokePositionsResponse.result;

const fakeVTokenBalances = fixtureAccountPool.positions.map(position => ({
  vToken: position.marketAddress,
  balanceOf: BigInt(position.vTokenBalanceMantissa),
  borrowBalanceCurrent: BigInt(position.borrowBalanceMantissa),
  balanceOfUnderlying: BigInt(position.underlyingBalanceMantissa),
  tokenBalance: 0n,
  tokenAllowance: 0n,
}));

const fakeEnteredVTokenAddresses = fixtureAccountPool.positions
  .filter(position => position.isCollateral)
  .map(position => position.marketAddress);

const buildPublicClient = ({ shouldFail = false }: { shouldFail?: boolean } = {}) =>
  ({
    simulateContract: vi.fn(async () => {
      if (shouldFail) {
        throw new Error('RPC unavailable');
      }

      return { result: fakeVTokenBalances };
    }),
    readContract: vi.fn(async () => fakeEnteredVTokenAddresses),
  }) as unknown as PublicClient;

const fakePublicClient = buildPublicClient();

const mockResponses = () =>
  (restService as Mock).mockImplementation(async () => ({ data: spokePoolsResponse }));

describe('getSpokePools', () => {
  beforeEach(() => {
    (getTokenBalances as Mock).mockImplementation(async () => ({
      tokenBalances: [{ token: usdc, balanceMantissa: new BigNumber('340000000') }],
    }));
  });

  it('formats pools and markets without an account', async () => {
    mockResponses();

    const { spokePools, totals } = await getSpokePools({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdc, usdt],
      publicClient: fakePublicClient,
    });

    expect(totals.poolCount).toBe(spokePoolsResponse.totals.poolCount);
    expect(totals.totalBorrowCents.toFixed()).toBe(spokePoolsResponse.totals.totalBorrowsUsdCents);
    expect(totals.availableLiquidityCents.toFixed()).toBe(
      spokePoolsResponse.totals.availableLiquidityUsdCents,
    );

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
    expect(collateral.isInactive).toBe(false);
    expect(loanAsset.isInactive).toBe(false);
    expect(restService).toHaveBeenCalledTimes(1);
  });

  it('flags inactive markets and keeps them on the side their liquidation threshold points to', async () => {
    const [apiPool] = spokePoolsResponse.result;

    (restService as Mock).mockImplementation(async () => ({
      data: {
        ...spokePoolsResponse,
        result: [
          {
            ...apiPool,
            markets: apiPool.markets.map(market => ({
              ...market,
              side: 'inactive',
              borrowCapsMantissa: '0',
              collateralFactorMantissa: '0',
              liquidationThresholdMantissa: market.symbol.startsWith('vUSDC')
                ? market.liquidationThresholdMantissa
                : '0',
            })),
          },
        ],
      },
    }));

    const { spokePools } = await getSpokePools({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdc, usdt],
      publicClient: fakePublicClient,
    });

    const [inactiveCollateral, inactiveLoanAsset] = spokePools[0].assets;

    expect(inactiveCollateral.isInactive).toBe(true);
    expect(inactiveCollateral.isBorrowable).toBe(false);
    expect(inactiveLoanAsset.isInactive).toBe(true);
    expect(inactiveLoanAsset.isBorrowable).toBe(true);
    expect(inactiveLoanAsset.isBorrowableByUser).toBe(false);
  });

  it('reads user balances and collateral membership on chain when an account is passed', async () => {
    mockResponses();
    const publicClient = buildPublicClient();

    const { spokePools } = await getSpokePools({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdc, usdt],
      publicClient,
      poolLensContractAddress: fakePoolLensContractAddress,
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
    expect(spokePool.userSupplyBalanceCents?.toFixed()).toBe('100000');
    expect(spokePool.userBorrowBalanceCents?.toFixed()).toBe('10000');
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: fakePoolLensContractAddress,
        functionName: 'vTokenBalancesAll',
        args: [
          spokePoolsResponse.result.flatMap(apiPool =>
            apiPool.markets.filter(market => market.isListed).map(market => market.address),
          ),
          fakeAccountAddress,
        ],
      }),
    );
    expect(publicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: spokePoolsResponse.result[0].address,
        functionName: 'getAssetsIn',
        args: [fakeAccountAddress],
      }),
    );
    expect(restService).toHaveBeenCalledTimes(1);
  });

  it('keeps the pools and flags the user data as unavailable when the on-chain read fails', async () => {
    mockResponses();

    const { spokePools } = await getSpokePools({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdc, usdt],
      publicClient: buildPublicClient({ shouldFail: true }),
      poolLensContractAddress: fakePoolLensContractAddress,
      accountAddress: fakeAccountAddress,
    });

    const [spokePool] = spokePools;

    expect(spokePool.isUserDataUnavailable).toBe(true);
    expect(spokePool.assets.every(asset => asset.userSupplyBalanceTokens.isEqualTo(0))).toBe(true);
  });

  it('does not read anything on chain when no account is passed', async () => {
    mockResponses();
    const publicClient = buildPublicClient({ shouldFail: true });

    const { spokePools } = await getSpokePools({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdc, usdt],
      publicClient,
      poolLensContractAddress: fakePoolLensContractAddress,
    });

    expect(spokePools[0].isUserDataUnavailable).toBe(false);
    expect(publicClient.simulateContract).not.toHaveBeenCalled();
  });

  it('requests every pool in one page instead of the default page size', async () => {
    mockResponses();

    await getSpokePools({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdc, usdt],
      publicClient: fakePublicClient,
    });

    expect(restService).toHaveBeenCalledWith({
      endpoint: '/spoke/pools',
      method: 'GET',
      params: { chainId: ChainId.BSC_TESTNET, limit: 500 },
    });
  });

  it('skips markets whose underlying token is unknown', async () => {
    mockResponses();

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
