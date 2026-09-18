import BigNumber from 'bignumber.js';

import { NULL_ADDRESS } from 'constants/address';
import type { SpokeAsset, VToken } from 'types';

export interface BuildSpokeAssetInput {
  vToken: VToken;
  tokenPriceCents: number;
  isBorrowable: boolean;
  isSupplyAllowlistEnabled?: boolean;
  collateralFactor?: number;
  liquidationThresholdPercentage?: number;
  liquidationPenaltyPercentage?: number;
  borrowApyPercentage?: number;
  supplyApyPercentage?: number;
  supplyBalanceTokens?: number;
  borrowBalanceTokens?: number;
  cashTokens?: number;
  supplyCapTokens?: number;
  borrowCapTokens?: number;
  userSupplyBalanceTokens?: number;
  userBorrowBalanceTokens?: number;
  userWalletBalanceTokens?: number;
  disabledTokenActions?: SpokeAsset['disabledTokenActions'];
}

export const buildSpokeAsset = ({
  vToken,
  tokenPriceCents,
  isBorrowable,
  isSupplyAllowlistEnabled = false,
  collateralFactor = 0,
  liquidationThresholdPercentage = 0,
  liquidationPenaltyPercentage = 10,
  borrowApyPercentage = 0,
  supplyApyPercentage = 0,
  supplyBalanceTokens = 0,
  borrowBalanceTokens = 0,
  cashTokens = 0,
  supplyCapTokens = 0,
  borrowCapTokens = 0,
  userSupplyBalanceTokens = 0,
  userBorrowBalanceTokens = 0,
  userWalletBalanceTokens = 0,
  disabledTokenActions = [],
}: BuildSpokeAssetInput): SpokeAsset => {
  const price = new BigNumber(tokenPriceCents);

  return {
    vToken,
    tokenPriceCents: price,
    tokenSupplyPriceCents: price,
    tokenBorrowPriceCents: price,
    tokenPriceOracleAddress: NULL_ADDRESS,
    isProtectionModeEnabled: false,
    isBorrowable,
    isSupplyAllowlistEnabled,
    reserveFactor: 0.1,
    collateralFactor,
    liquidationThresholdPercentage,
    liquidationPenaltyPercentage,
    badDebtMantissa: 0n,
    reserveTokens: new BigNumber(0),
    cashTokens: new BigNumber(cashTokens),
    liquidityCents: new BigNumber(cashTokens).multipliedBy(price),
    exchangeRateVTokens: new BigNumber(50),
    supplierCount: 0,
    borrowerCount: 352,
    borrowApyPercentage: new BigNumber(borrowApyPercentage),
    supplyApyPercentage: new BigNumber(supplyApyPercentage),
    supplyBalanceTokens: new BigNumber(supplyBalanceTokens),
    supplyBalanceCents: new BigNumber(supplyBalanceTokens).multipliedBy(price),
    borrowBalanceTokens: new BigNumber(borrowBalanceTokens),
    borrowBalanceCents: new BigNumber(borrowBalanceTokens).multipliedBy(price),
    supplyTokenDistributions: [],
    borrowTokenDistributions: [],
    supplyPointDistributions: [],
    borrowPointDistributions: [],
    disabledTokenActions,
    borrowCapTokens: new BigNumber(borrowCapTokens),
    supplyCapTokens: new BigNumber(supplyCapTokens),
    isRestricted: false,
    isGated: false,
    userSupplyBalanceTokens: new BigNumber(userSupplyBalanceTokens),
    userSupplyBalanceCents: new BigNumber(userSupplyBalanceTokens).multipliedBy(price),
    userSupplyBalanceProtectedCents: new BigNumber(0),
    userBorrowBalanceTokens: new BigNumber(userBorrowBalanceTokens),
    userBorrowBalanceCents: new BigNumber(userBorrowBalanceTokens).multipliedBy(price),
    userBorrowBalanceProtectedCents: new BigNumber(0),
    userWalletBalanceTokens: new BigNumber(userWalletBalanceTokens),
    userWalletBalanceCents: new BigNumber(userWalletBalanceTokens).multipliedBy(price),
    userCollateralFactor: collateralFactor,
    userLiquidationThresholdPercentage: liquidationThresholdPercentage,
    userBorrowLimitSharePercentage: 0,
    isBorrowableByUser: isBorrowable,
    isCollateralOfUser: userSupplyBalanceTokens > 0,
  };
};
