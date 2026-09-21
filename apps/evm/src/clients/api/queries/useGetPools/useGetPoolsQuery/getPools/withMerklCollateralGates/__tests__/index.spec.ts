import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { isolatedPool, legacyCorePool } from '__mocks__/models/pools';
import { xvs } from '__mocks__/models/tokens';
import { vUsdc, vUsdtCorePool, vXvs } from '__mocks__/models/vTokens';
import type { Asset, MerklDistribution, Pool, VToken } from 'types';

import { withMerklCollateralGates } from '..';

const buildGatedDistribution = (): MerklDistribution => ({
  type: 'merkl',
  token: xvs,
  apyPercentage: new BigNumber(20),
  dailyDistributedTokens: new BigNumber(0),
  isActive: true,
  rewardDetails: {
    appName: 'Merkl',
    claimUrl: 'https://app.merkl.xyz/',
    marketAddress: vUsdtCorePool.address,
    merklCampaignIdentifier: '0xfake',
    description: 'Merkl campaign',
    tags: [],
    aprPercentage: 20,
    participatingCollateralAddresses: [vXvs.address],
    eligibleBorrowMarketAddresses: [vUsdtCorePool.address, vUsdc.address],
  },
});

const buildAsset = ({ vToken, ...overrides }: { vToken: VToken } & Partial<Asset>): Asset => ({
  ...assetData[0],
  vToken,
  isCollateralOfUser: false,
  userSupplyBalanceCents: new BigNumber(0),
  userBorrowBalanceCents: new BigNumber(0),
  supplyTokenDistributions: [],
  borrowTokenDistributions: [],
  ...overrides,
});

// $1000 of collateral at a 60% collateral factor, against $500 of USDT and $500 of USDC borrows
const buildPools = ({
  collateralCents = new BigNumber(100000),
  isCollateralOfUser = true,
  usdtBorrowCents = new BigNumber(50000),
  usdcBorrowCents = new BigNumber(50000),
}: {
  collateralCents?: BigNumber;
  isCollateralOfUser?: boolean;
  usdtBorrowCents?: BigNumber;
  usdcBorrowCents?: BigNumber;
} = {}): Pool[] => [
  {
    ...legacyCorePool,
    assets: [
      buildAsset({
        vToken: vXvs,
        isCollateralOfUser,
        userSupplyBalanceCents: collateralCents,
        userCollateralFactor: 0.6,
      }),
      buildAsset({
        vToken: vUsdtCorePool,
        userBorrowBalanceCents: usdtBorrowCents,
        borrowTokenDistributions: [buildGatedDistribution()],
      }),
      buildAsset({
        vToken: vUsdc,
        userBorrowBalanceCents: usdcBorrowCents,
        borrowTokenDistributions: [buildGatedDistribution()],
      }),
    ],
  },
];

const getGate = (assets: Asset[], assetIndex: number) => {
  const distribution = assets[assetIndex].borrowTokenDistributions[0];
  return distribution.type === 'merkl' ? distribution : undefined;
};

describe('appendMerklCollateralGates', () => {
  it('scales the campaign APR down by the share of the loan the collateral covers', () => {
    const pools = buildPools();

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    const distribution = getGate(assets, 1);
    expect(distribution?.collateralGate?.isUserEligible).toBe(true);
    expect(distribution?.collateralGate?.maxApyPercentage.toFixed()).toBe('20');
    // 20% * min($600, $1000) / $1000
    expect(distribution?.apyPercentage.toFixed()).toBe('12');
  });

  it('applies the same reward APY to every eligible borrow market of the campaign', () => {
    const pools = buildPools();

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    expect(getGate(assets, 2)?.apyPercentage.toFixed()).toBe('12');
  });

  it('awards the full campaign APR when the collateral covers the whole loan', () => {
    const pools = buildPools({ collateralCents: new BigNumber(1000000) });

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    expect(getGate(assets, 1)?.apyPercentage.toFixed()).toBe('20');
  });

  it('marks the user as ineligible when they hold none of the participating collateral', () => {
    const pools = buildPools({ collateralCents: new BigNumber(0) });

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    const distribution = getGate(assets, 1);
    expect(distribution?.collateralGate?.isUserEligible).toBe(false);
    expect(distribution?.apyPercentage.toFixed()).toBe('0');
  });

  it('marks the user as ineligible when the participating collateral is not enabled', () => {
    const pools = buildPools({ isCollateralOfUser: false });

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    expect(getGate(assets, 1)?.collateralGate?.isUserEligible).toBe(false);
  });

  it('marks the user as ineligible when they borrow none of the eligible markets', () => {
    const pools = buildPools({
      usdtBorrowCents: new BigNumber(0),
      usdcBorrowCents: new BigNumber(0),
    });

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    const distribution = getGate(assets, 1);
    expect(distribution?.collateralGate?.isUserEligible).toBe(false);
    expect(distribution?.apyPercentage.toFixed()).toBe('0');
  });

  it('leaves ungated Merkl campaigns untouched', () => {
    const ungatedDistribution: MerklDistribution = {
      ...buildGatedDistribution(),
      apyPercentage: new BigNumber(5),
      rewardDetails: {
        ...buildGatedDistribution().rewardDetails,
        participatingCollateralAddresses: [],
        eligibleBorrowMarketAddresses: [],
      },
    };

    const pools: Pool[] = [
      {
        ...legacyCorePool,
        assets: [
          buildAsset({
            vToken: vUsdtCorePool,
            borrowTokenDistributions: [ungatedDistribution],
          }),
        ],
      },
    ];

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    const distribution = getGate(assets, 0);
    expect(distribution?.collateralGate).toBeUndefined();
    expect(distribution?.apyPercentage.toFixed()).toBe('5');
  });

  it('ignores collateral held in another pool, which cannot back the borrow', () => {
    const pools: Pool[] = [
      {
        ...legacyCorePool,
        assets: [
          buildAsset({
            vToken: vUsdtCorePool,
            userBorrowBalanceCents: new BigNumber(50000),
            borrowTokenDistributions: [buildGatedDistribution()],
          }),
        ],
      },
      {
        ...isolatedPool,
        assets: [
          buildAsset({
            vToken: vXvs,
            isCollateralOfUser: true,
            userSupplyBalanceCents: new BigNumber(100000),
            userCollateralFactor: 0.6,
          }),
        ],
      },
    ];

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    const distribution = getGate(assets, 0);
    expect(distribution?.collateralGate?.isUserEligible).toBe(false);
    expect(distribution?.apyPercentage.toFixed()).toBe('0');
  });

  it('leaves the campaign alone when it reports no rate', () => {
    const noRateDistribution: MerklDistribution = {
      ...buildGatedDistribution(),
      apyPercentage: new BigNumber(0),
      rewardDetails: { ...buildGatedDistribution().rewardDetails, aprPercentage: 0 },
    };

    const pools = buildPools();
    pools[0].assets[1].borrowTokenDistributions = [noRateDistribution];

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    expect(getGate(assets, 1)?.collateralGate).toBeUndefined();
    expect(getGate(assets, 1)?.apyPercentage.toFixed()).toBe('0');
  });

  it('returns the exact same references when no pool asset carries a gated campaign', () => {
    const pools = buildPools();
    pools[0].assets.forEach(asset => {
      asset.borrowTokenDistributions = [];
    });

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    expect(assets).toBe(pools[0].assets);
  });

  it('never touches supply distributions or unrelated assets', () => {
    const pools = buildPools();
    const collateralAsset = pools[0].assets[0];
    const supplyDistributions = collateralAsset.supplyTokenDistributions;

    const assets = withMerklCollateralGates({ assets: pools[0].assets });

    expect(assets[0]).toBe(collateralAsset);
    expect(assets[0].supplyTokenDistributions).toBe(supplyDistributions);
  });

  it('does not mutate the assets it was given', () => {
    const pools = buildPools();
    const original = pools[0].assets[1].borrowTokenDistributions[0];

    withMerklCollateralGates({ assets: pools[0].assets });

    expect(original.type === 'merkl' && original.collateralGate).toBeUndefined();
  });
});
