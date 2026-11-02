import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import type { Asset, BalanceMutation, LiquidityHub, Pool } from 'types';

import { getSimulatedLiquidityHubTokenDistributions } from '..';

const primeToken = assetData[0].vToken.underlyingToken;

const liquidityHub: LiquidityHub = {
  ...liquidityHubs[0],
  pricePerShare: new BigNumber(1),
  redeemFeePercentage: new BigNumber(0),
  userVhTokenBalanceTokens: new BigNumber(100),
  supplyTokenDistributions: [
    { type: 'prime', token: primeToken, apyPercentage: new BigNumber(8.015), isActive: true },
  ],
};

const makeVhAsset = ({
  coreVhTokens,
  primeApyPercentage,
}: { coreVhTokens: number; primeApyPercentage: number }): Asset => ({
  ...assetData[0],
  vToken: {
    ...assetData[0].vToken,
    underlyingToken: { ...liquidityHub.vhToken, iconSrc: primeToken.iconSrc },
  },
  userSupplyBalanceTokens: new BigNumber(coreVhTokens),
  supplyTokenDistributions: [
    {
      type: 'prime',
      token: primeToken,
      apyPercentage: new BigNumber(primeApyPercentage),
      isActive: true,
    },
  ],
});

const makePool = (asset: Asset): Pool => ({ ...poolData[0], assets: [asset] });

const corePool = makePool(makeVhAsset({ coreVhTokens: 100, primeApyPercentage: 16.03 }));

const getPrimeApy = (
  distributions?: ReturnType<typeof getSimulatedLiquidityHubTokenDistributions>,
) =>
  distributions
    ?.find(distribution => distribution.type === 'prime')
    ?.apyPercentage.toFixed(2, BigNumber.ROUND_HALF_UP);

describe('getSimulatedLiquidityHubTokenDistributions', () => {
  it('weights the Prime APY estimated for the new Core balance after a resupplied deposit', () => {
    const balanceMutations: BalanceMutation[] = [
      {
        type: 'liquidityHub',
        vhTokenAddress: liquidityHub.vhToken.address,
        action: 'supply',
        amountTokens: new BigNumber(100),
      },
    ];

    const distributions = getSimulatedLiquidityHubTokenDistributions({
      liquidityHub,
      corePool,
      simulatedCorePool: makePool(makeVhAsset({ coreVhTokens: 200, primeApyPercentage: 10.98 })),
      balanceMutations,
    });

    // 10.98% x 200 / 300
    expect(getPrimeApy(distributions)).toBe('7.32');
  });

  it('re-weights the current Prime APY after a withdrawal covered by wallet vhTokens', () => {
    const distributions = getSimulatedLiquidityHubTokenDistributions({
      liquidityHub,
      corePool,
      balanceMutations: [
        {
          type: 'liquidityHub',
          vhTokenAddress: liquidityHub.vhToken.address,
          action: 'withdraw',
          amountTokens: new BigNumber(50),
        },
      ],
    });

    // 16.03% x 100 / 150
    expect(getPrimeApy(distributions)).toBe('10.69');
  });

  it('burns the extra shares the redeem fee takes when re-weighting a withdrawal', () => {
    const distributions = getSimulatedLiquidityHubTokenDistributions({
      liquidityHub: { ...liquidityHub, redeemFeePercentage: new BigNumber(1) },
      corePool,
      balanceMutations: [
        {
          type: 'liquidityHub',
          vhTokenAddress: liquidityHub.vhToken.address,
          action: 'withdraw',
          amountTokens: new BigNumber(49.5),
        },
      ],
    });

    // 49.5 / 0.99 = 50 shares leave the wallet: 16.03% x 100 / 150
    expect(getPrimeApy(distributions)).toBe('10.69');
  });

  it('returns nothing when the Liquidity Hub earns no Prime', () => {
    expect(
      getSimulatedLiquidityHubTokenDistributions({
        liquidityHub: { ...liquidityHub, supplyTokenDistributions: [] },
        corePool,
        balanceMutations: [
          {
            type: 'liquidityHub',
            vhTokenAddress: liquidityHub.vhToken.address,
            action: 'supply',
            amountTokens: new BigNumber(100),
          },
        ],
      }),
    ).toBeUndefined();
  });

  it('returns nothing without an amount', () => {
    expect(
      getSimulatedLiquidityHubTokenDistributions({ liquidityHub, corePool, balanceMutations: [] }),
    ).toBeUndefined();
  });
});
