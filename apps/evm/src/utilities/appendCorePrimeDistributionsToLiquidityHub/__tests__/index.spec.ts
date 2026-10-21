import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import type { Asset, LiquidityHub, Pool } from 'types';
import { appendCorePrimeDistributionsToLiquidityHub } from '..';

const liquidityHub: LiquidityHub = {
  ...liquidityHubs[0],
  supplyTokenDistributions: [],
  userVhTokenBalanceTokens: new BigNumber(100),
};

const primeToken = assetData[0].vToken.underlyingToken;

const vhAsset: Asset = {
  ...assetData[0],
  vToken: {
    ...assetData[0].vToken,
    underlyingToken: {
      ...liquidityHub.vhToken,
      iconSrc: primeToken.iconSrc,
    },
  },
  userSupplyBalanceTokens: new BigNumber(100),
  supplyTokenDistributions: [
    {
      type: 'prime',
      token: primeToken,
      apyPercentage: new BigNumber(8),
      isActive: true,
    },
    {
      type: 'primeSimulation',
      token: primeToken,
      apyPercentage: new BigNumber(10),
      isActive: true,
      referenceValues: {
        userSupplyBalanceTokens: new BigNumber(1),
        userBorrowBalanceTokens: new BigNumber(0),
        userXvsStakedTokens: new BigNumber(1),
      },
    },
  ],
};

const corePool: Pool = {
  ...poolData[0],
  assets: [vhAsset],
};

describe('appendCorePrimeDistributionsToLiquidityHub', () => {
  it('weights the Prime APY by the share of the position supplied to Core', () => {
    const result = appendCorePrimeDistributionsToLiquidityHub({ liquidityHub, corePool });

    const prime = result.supplyTokenDistributions.find(
      distribution => distribution.type === 'prime',
    );
    const primeSimulation = result.supplyTokenDistributions.find(
      distribution => distribution.type === 'primeSimulation',
    );

    // PRD §7 example: 8% x 100 / 200 = 4%
    expect(prime?.apyPercentage.toFixed()).toBe('4');
    expect(primeSimulation?.apyPercentage.toFixed()).toBe('10');
  });

  it('converts the Prime reference balance from vhTokens to the underlying token', () => {
    const result = appendCorePrimeDistributionsToLiquidityHub({
      liquidityHub: { ...liquidityHub, pricePerShare: new BigNumber(1.5) },
      corePool,
    });

    const primeSimulation = result.supplyTokenDistributions.find(
      distribution => distribution.type === 'primeSimulation',
    );

    expect(
      primeSimulation?.type === 'primeSimulation' &&
        primeSimulation.referenceValues.userSupplyBalanceTokens.toFixed(),
    ).toBe('1.5');
  });

  it('returns a 0% effective Prime APY when nothing is supplied', () => {
    const result = appendCorePrimeDistributionsToLiquidityHub({
      liquidityHub: { ...liquidityHub, userVhTokenBalanceTokens: undefined },
      corePool: {
        ...corePool,
        assets: [{ ...vhAsset, userSupplyBalanceTokens: new BigNumber(0) }],
      },
    });

    expect(
      result.supplyTokenDistributions
        .find(distribution => distribution.type === 'prime')
        ?.apyPercentage.toFixed(),
    ).toBe('0');
  });

  it('leaves the Liquidity Hub untouched when it has no Core market', () => {
    expect(
      appendCorePrimeDistributionsToLiquidityHub({
        liquidityHub,
        corePool: { ...corePool, assets: [assetData[1]] },
      }),
    ).toBe(liquidityHub);
  });

  it('leaves the Liquidity Hub untouched when its Core market is not a Prime market', () => {
    expect(
      appendCorePrimeDistributionsToLiquidityHub({
        liquidityHub,
        corePool: { ...corePool, assets: [{ ...vhAsset, supplyTokenDistributions: [] }] },
      }),
    ).toBe(liquidityHub);
  });
});
