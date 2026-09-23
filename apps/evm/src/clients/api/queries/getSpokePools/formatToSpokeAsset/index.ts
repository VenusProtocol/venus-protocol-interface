import BigNumber from 'bignumber.js';

import { NULL_ADDRESS } from 'constants/address';
import { COMPOUND_DECIMALS, COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import type { ChainId, SpokeAsset, Token, TokenBalance, VToken } from 'types';
import {
  areAddressesEqual,
  convertDollarsToCents,
  convertFactorFromSmartContract,
  convertMantissaToTokens,
  convertPercentageFromSmartContract,
  convertPriceMantissaToDollars,
  getDisabledTokenActions,
} from 'utilities';

import type { ApiSpokeMarket, ApiSpokePosition } from '../types';

export interface FormatToSpokeAssetInput {
  apiMarket: ApiSpokeMarket;
  chainId: ChainId;
  tokens: Token[];
  isUserConnected: boolean;
  userPosition?: ApiSpokePosition;
  userTokenBalances: TokenBalance[];
}

export const formatToSpokeAsset = ({
  apiMarket,
  chainId,
  tokens,
  isUserConnected,
  userPosition,
  userTokenBalances,
}: FormatToSpokeAssetInput): SpokeAsset | undefined => {
  const underlyingToken = tokens.find(
    token =>
      !!apiMarket.underlyingAddress &&
      areAddressesEqual(token.address, apiMarket.underlyingAddress),
  );

  if (!apiMarket.isListed || !underlyingToken) {
    return undefined;
  }

  const vToken: VToken = {
    address: apiMarket.address,
    chainId: underlyingToken.chainId,
    decimals: 8,
    symbol: apiMarket.symbol ?? `v${underlyingToken.symbol}`,
    underlyingToken,
  };

  const tokenPriceCents = convertDollarsToCents(
    convertPriceMantissaToDollars({
      priceMantissa: apiMarket.underlyingPriceMantissa,
      decimals: underlyingToken.decimals,
    }),
  );

  const toTokens = (mantissa: string) =>
    convertMantissaToTokens({ value: new BigNumber(mantissa), token: underlyingToken });

  const collateralFactor = convertFactorFromSmartContract({
    factor: new BigNumber(apiMarket.collateralFactorMantissa),
  });

  const liquidationThresholdPercentage = convertPercentageFromSmartContract(
    apiMarket.liquidationThresholdMantissa,
  );

  const exchangeRateVTokens = new BigNumber(1).div(
    new BigNumber(apiMarket.exchangeRateMantissa).div(
      10 ** (COMPOUND_DECIMALS + underlyingToken.decimals - vToken.decimals),
    ),
  );

  const supplyBalanceTokens = convertMantissaToTokens({
    value: new BigNumber(apiMarket.totalSupplyMantissa),
    token: vToken,
  }).div(exchangeRateVTokens);

  const borrowBalanceTokens = toTokens(apiMarket.totalBorrowsMantissa);
  const cashTokens = toTokens(apiMarket.cashMantissa);

  const userSupplyBalanceTokens = userPosition
    ? toTokens(userPosition.underlyingBalanceMantissa)
    : new BigNumber(0);

  const userBorrowBalanceTokens = userPosition
    ? toTokens(userPosition.borrowBalanceMantissa)
    : new BigNumber(0);

  const userTokenBalance = userTokenBalances.find(({ token }) =>
    areAddressesEqual(token.address, underlyingToken.address),
  );

  const userWalletBalanceTokens = userTokenBalance
    ? convertMantissaToTokens({ value: userTokenBalance.balanceMantissa, token: underlyingToken })
    : new BigNumber(0);

  const isBorrowable = apiMarket.side === 'liquidity';

  const spokeAsset: SpokeAsset = {
    vToken,
    tokenPriceCents,
    tokenSupplyPriceCents: tokenPriceCents,
    tokenBorrowPriceCents: tokenPriceCents,
    isProtectionModeEnabled: false,
    tokenPriceOracleAddress: NULL_ADDRESS,
    isBorrowable,
    isSuppliable: apiMarket.suppliable,
    reserveFactor: convertFactorFromSmartContract({
      factor: new BigNumber(apiMarket.reserveFactorMantissa),
    }),
    collateralFactor,
    liquidationThresholdPercentage,
    liquidationPenaltyPercentage: convertPercentageFromSmartContract(
      new BigNumber(apiMarket.liquidationIncentiveMantissa).minus(COMPOUND_MANTISSA),
    ),
    badDebtMantissa: 0n,
    cashTokens,
    liquidityCents: cashTokens.multipliedBy(tokenPriceCents),
    reserveTokens: toTokens(apiMarket.totalReservesMantissa),
    exchangeRateVTokens,
    supplierCount: 0,
    borrowerCount: 0,
    borrowApyPercentage: new BigNumber(apiMarket.borrowApyDecimal).multipliedBy(100),
    supplyApyPercentage: new BigNumber(apiMarket.supplyApyDecimal).multipliedBy(100),
    supplyBalanceTokens,
    supplyBalanceCents: supplyBalanceTokens.multipliedBy(tokenPriceCents),
    hubSupplyBalanceCents: apiMarket.hubSupplied
      ? toTokens(apiMarket.hubSupplied).multipliedBy(tokenPriceCents)
      : undefined,
    borrowBalanceTokens,
    borrowBalanceCents: borrowBalanceTokens.multipliedBy(tokenPriceCents),
    supplyTokenDistributions: [],
    borrowTokenDistributions: [],
    supplyPointDistributions: [],
    borrowPointDistributions: [],
    disabledTokenActions: getDisabledTokenActions({
      bitmask: apiMarket.pausedActionsBitmap,
      tokenAddresses: [vToken.address, underlyingToken.address],
      chainId,
    }),
    borrowCapTokens: toTokens(apiMarket.borrowCapsMantissa),
    supplyCapTokens: toTokens(apiMarket.supplyCapsMantissa),
    isRestricted: false,
    isGated: false,
    userSupplyBalanceTokens,
    userSupplyBalanceCents: userSupplyBalanceTokens.multipliedBy(tokenPriceCents),
    userSupplyBalanceProtectedCents: userSupplyBalanceTokens.multipliedBy(tokenPriceCents),
    userBorrowBalanceTokens,
    userBorrowBalanceCents: userBorrowBalanceTokens.multipliedBy(tokenPriceCents),
    userBorrowBalanceProtectedCents: userBorrowBalanceTokens.multipliedBy(tokenPriceCents),
    userWalletBalanceTokens,
    userWalletBalanceCents: userWalletBalanceTokens.multipliedBy(tokenPriceCents),
    userCollateralFactor: isUserConnected ? collateralFactor : 0,
    userLiquidationThresholdPercentage: isUserConnected ? liquidationThresholdPercentage : 0,
    userBorrowLimitSharePercentage: 0,
    isBorrowableByUser: isBorrowable,
    isCollateralOfUser: !!userPosition?.isCollateral,
  };

  return spokeAsset;
};
