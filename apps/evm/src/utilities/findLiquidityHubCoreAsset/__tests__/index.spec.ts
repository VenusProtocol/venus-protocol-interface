import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';

import { findLiquidityHubCoreAsset } from '..';

const liquidityHub = liquidityHubs[0];

describe('findLiquidityHubCoreAsset', () => {
  it('returns the Core market wrapping the Liquidity Hub shares', () => {
    const vhAsset = {
      ...assetData[1],
      vToken: {
        ...assetData[1].vToken,
        underlyingToken: { ...liquidityHub.vhToken, iconSrc: '' },
      },
    };

    expect(
      findLiquidityHubCoreAsset({
        pool: { ...poolData[0], assets: [assetData[0], vhAsset] },
        liquidityHub,
      }),
    ).toBe(vhAsset);
  });

  it('returns nothing when the pool has no such market', () => {
    expect(
      findLiquidityHubCoreAsset({ pool: { ...poolData[0], assets: [assetData[0]] }, liquidityHub }),
    ).toBeUndefined();
  });
});
