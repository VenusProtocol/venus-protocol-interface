import fakeAddress, { altAddress } from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import type { YieldPlusPosition } from 'types';
import { formatToYieldPlusPosition } from 'utilities/formatToYieldPlusPosition';

const pool = poolData[0];
const xvsAsset = pool.assets[0];
const usdcAsset = pool.assets[1];
const usdtAsset = pool.assets[2];
const busdAsset = pool.assets[3];

export const yieldPlusPositions: YieldPlusPosition[] = [
  formatToYieldPlusPosition({
    pool,
    chainId: busdAsset.vToken.underlyingToken.chainId,
    positionAccountAddress: fakeAddress,
    dsaVTokenAddress: xvsAsset.vToken.address,
    longVTokenAddress: usdtAsset.vToken.address,
    shortVTokenAddress: busdAsset.vToken.address,
    leverageFactor: 2,
    unrealizedPnlCents: 0,
    unrealizedPnlPercentage: 0,
    averageEntryRatio: 1,
  })!,
  formatToYieldPlusPosition({
    pool,
    chainId: busdAsset.vToken.underlyingToken.chainId,
    positionAccountAddress: altAddress,
    dsaVTokenAddress: usdcAsset.vToken.address,
    longVTokenAddress: usdtAsset.vToken.address,
    shortVTokenAddress: busdAsset.vToken.address,
    leverageFactor: 3,
    unrealizedPnlCents: 150,
    unrealizedPnlPercentage: 1.2,
    averageEntryRatio: 1.1,
  })!,
];
