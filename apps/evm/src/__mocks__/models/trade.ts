import type { ApiTradePosition } from 'clients/api/queries/getRawTradePositions';
import type { TradePosition } from 'types';
import { convertTokensToMantissa } from 'utilities';
import { formatToTradePosition } from 'utilities/formatToTradePosition';
import fakeAddress, { altAddress } from './address';
import { poolData } from './pools';

const pool = poolData[0];
const xvsAsset = pool.assets[0];
const usdcAsset = pool.assets[1];
const usdtAsset = pool.assets[2];
const busdAsset = pool.assets[3];

export const apiTradePositions: ApiTradePosition[] = [
  {
    pnl: {
      realizedPnlShortAssetMantissa: '0',
      realizedPnlUsd: '0',
      unrealizedPnlShortAssetMantissa: '0',
      unrealizedPnlUsd: '0',
      unrealizedPnlRatio: '0',
      entryRatio: '1',
      currentRatio: '1',
      closeEventsWithPnlData: [],
      totalShortOpenedMantissa: '0',
      totalLongReceivedMantissa: '0',
    },
    positionAccountAddress: fakeAddress,
    accountAddress: fakeAddress,
    longVTokenAddress: usdtAsset.vToken.address,
    shortVTokenAddress: busdAsset.vToken.address,
    chainId: String(busdAsset.vToken.underlyingToken.chainId),
    isActive: true,
    cycleId: '1',
    dsaVTokenAddress: xvsAsset.vToken.address,
    effectiveLeverageRatio: '2',
    capitalUtilization: {
      suppliedPrincipalMantissa: convertTokensToMantissa({
        value: xvsAsset.userSupplyBalanceTokens,
        token: xvsAsset.vToken.underlyingToken,
      }).toFixed(),
      capitalUtilizedMantissa: '0',
      withdrawableCapitalMantissa: '0',
    },
  },
  {
    positionAccountAddress: altAddress,
    accountAddress: altAddress,
    dsaVTokenAddress: usdcAsset.vToken.address,
    longVTokenAddress: usdtAsset.vToken.address,
    shortVTokenAddress: busdAsset.vToken.address,
    chainId: String(busdAsset.vToken.underlyingToken.chainId),
    isActive: true,
    cycleId: '1',
    effectiveLeverageRatio: '3',
    pnl: {
      realizedPnlShortAssetMantissa: '0',
      realizedPnlUsd: '0',
      unrealizedPnlShortAssetMantissa: '0',
      unrealizedPnlUsd: '1.5',
      unrealizedPnlRatio: '0.12',
      entryRatio: '1.1',
      currentRatio: '1.1',
      closeEventsWithPnlData: [],
      totalShortOpenedMantissa: '0',
      totalLongReceivedMantissa: '0',
    },
    capitalUtilization: {
      suppliedPrincipalMantissa: convertTokensToMantissa({
        value: usdcAsset.userSupplyBalanceTokens,
        token: usdcAsset.vToken.underlyingToken,
      }).toFixed(),
      capitalUtilizedMantissa: '0',
      withdrawableCapitalMantissa: '0',
    },
  },
  {
    positionAccountAddress: altAddress,
    accountAddress: altAddress,
    dsaVTokenAddress: usdcAsset.vToken.address,
    longVTokenAddress: usdcAsset.vToken.address,
    shortVTokenAddress: usdtAsset.vToken.address,
    chainId: String(usdtAsset.vToken.underlyingToken.chainId),
    isActive: true,
    cycleId: '1',
    effectiveLeverageRatio: '1.5',
    pnl: {
      realizedPnlShortAssetMantissa: '0',
      realizedPnlUsd: '0',
      unrealizedPnlShortAssetMantissa: '0',
      unrealizedPnlUsd: '-0.5',
      unrealizedPnlRatio: '-0.4',
      entryRatio: '0.95',
      currentRatio: '0.95',
      closeEventsWithPnlData: [],
      totalShortOpenedMantissa: '0',
      totalLongReceivedMantissa: '0',
    },
    capitalUtilization: {
      suppliedPrincipalMantissa: convertTokensToMantissa({
        value: usdcAsset.userSupplyBalanceTokens,
        token: usdcAsset.vToken.underlyingToken,
      }).toFixed(),
      capitalUtilizedMantissa: '0',
      withdrawableCapitalMantissa: '0',
    },
  },
];

export const tradePositions: TradePosition[] = [
  formatToTradePosition({
    pool,
    chainId: busdAsset.vToken.underlyingToken.chainId,
    positionAccountAddress: fakeAddress,
    dsaVTokenAddress: xvsAsset.vToken.address,
    dsaBalanceMantissa: convertTokensToMantissa({
      value: xvsAsset.userSupplyBalanceTokens,
      token: xvsAsset.vToken.underlyingToken,
    }),
    longVTokenAddress: usdtAsset.vToken.address,
    shortVTokenAddress: busdAsset.vToken.address,
    leverageFactor: 2,
    unrealizedPnlCents: 0,
    unrealizedPnlPercentage: 0,
  })!,
  formatToTradePosition({
    pool,
    chainId: busdAsset.vToken.underlyingToken.chainId,
    positionAccountAddress: altAddress,
    dsaVTokenAddress: usdcAsset.vToken.address,
    dsaBalanceMantissa: convertTokensToMantissa({
      value: usdcAsset.userSupplyBalanceTokens,
      token: usdcAsset.vToken.underlyingToken,
    }),
    longVTokenAddress: usdtAsset.vToken.address,
    shortVTokenAddress: busdAsset.vToken.address,
    leverageFactor: 3,
    unrealizedPnlCents: 150,
    unrealizedPnlPercentage: 1.2,
  })!,
  formatToTradePosition({
    pool,
    chainId: usdtAsset.vToken.underlyingToken.chainId,
    positionAccountAddress: altAddress,
    dsaVTokenAddress: usdcAsset.vToken.address,
    dsaBalanceMantissa: convertTokensToMantissa({
      value: usdcAsset.userSupplyBalanceTokens,
      token: usdcAsset.vToken.underlyingToken,
    }),
    longVTokenAddress: usdcAsset.vToken.address,
    shortVTokenAddress: usdtAsset.vToken.address,
    leverageFactor: 1.5,
    unrealizedPnlCents: -50,
    unrealizedPnlPercentage: -0.4,
  })!,
];
