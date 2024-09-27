import BigNumber from 'bignumber.js';

import type { ChainId } from '@venusprotocol/chains';
import { NATIVE_TOKEN_ADDRESS, NULL_ADDRESS } from 'constants/address';
import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import type { LegacyPoolComptroller, ResilientOracle, VenusLens } from 'libs/contracts';
import type { Asset, Market, Pool, PrimeApy, Token, VToken } from 'types';
import {
  addUserPropsToPool,
  areAddressesEqual,
  calculateDailyTokenRate,
  calculateYearlyPercentageRate,
  convertDollarsToCents,
  convertFactorFromSmartContract,
  convertMantissaToTokens,
  convertPriceMantissaToDollars,
  getDisabledTokenActions,
} from 'utilities';
import findTokenByAddress from 'utilities/findTokenByAddress';
import { formatDistributions } from './formatDistributions';

export interface FormatToPoolInput {
  chainId: ChainId;
  name: string;
  xvs: Token;
  vai?: Token;
  tokens: Token[];
  description: string;
  comptrollerContractAddress: string;
  vTokenMetadataResults: Awaited<ReturnType<VenusLens['callStatic']['vTokenMetadataAll']>>;
  underlyingTokenPriceResults: PromiseSettledResult<
    Awaited<ReturnType<ResilientOracle['getPrice']>>
  >[];
  borrowCapsResults: PromiseSettledResult<
    Awaited<ReturnType<LegacyPoolComptroller['borrowCaps']>>
  >[];
  supplyCapsResults: PromiseSettledResult<
    Awaited<ReturnType<LegacyPoolComptroller['supplyCaps']>>
  >[];
  xvsBorrowSpeedResults: PromiseSettledResult<
    Awaited<ReturnType<LegacyPoolComptroller['venusBorrowSpeeds']>>
  >[];
  xvsSupplySpeedResults: PromiseSettledResult<
    Awaited<ReturnType<LegacyPoolComptroller['venusSupplySpeeds']>>
  >[];
  xvsPriceMantissa: BigNumber;
  primeApyMap: Map<string, PrimeApy>;
  userCollateralizedVTokenAddresses?: string[];
  userVTokenBalances?: Awaited<ReturnType<VenusLens['callStatic']['vTokenBalancesAll']>>;
  userVaiBorrowBalanceMantissa?: BigNumber;
  mainMarkets?: Market[];
  blocksPerDay?: number;
}

export const formatToPool = ({
  chainId,
  blocksPerDay,
  name,
  xvs,
  vai,
  tokens,
  description,
  comptrollerContractAddress,
  vTokenMetadataResults,
  underlyingTokenPriceResults,
  borrowCapsResults,
  supplyCapsResults,
  xvsBorrowSpeedResults,
  xvsSupplySpeedResults,
  xvsPriceMantissa,
  userCollateralizedVTokenAddresses,
  userVTokenBalances,
  userVaiBorrowBalanceMantissa,
  primeApyMap,
  mainMarkets,
}: FormatToPoolInput) => {
  const assets: Asset[] = [];

  vTokenMetadataResults.forEach((vTokenMetadata, index) => {
    // Remove unlisted tokens
    if (!vTokenMetadata.isListed) {
      return;
    }

    const underlyingTokenAddress =
      // If underlying asset address is the null address, this means the VToken has no underlying
      // token because it is a native token
      areAddressesEqual(vTokenMetadata.underlyingAssetAddress, NULL_ADDRESS)
        ? NATIVE_TOKEN_ADDRESS
        : vTokenMetadata.underlyingAssetAddress;

    const underlyingToken = findTokenByAddress({
      tokens,
      address: underlyingTokenAddress,
    });

    if (!underlyingToken) {
      return;
    }

    const vToken: VToken = {
      decimals: 8,
      address: vTokenMetadata.vToken,
      symbol: `v${underlyingToken.symbol}`,
      underlyingToken,
    };

    const underlyingTokenPriceResult = underlyingTokenPriceResults[index];
    const underlyingTokenPriceMantissa =
      underlyingTokenPriceResult.status === 'fulfilled'
        ? new BigNumber(underlyingTokenPriceResult.value.toString())
        : undefined;

    if (!underlyingTokenPriceMantissa) {
      return;
    }

    const borrowCapsResult = borrowCapsResults[index];
    const borrowCapsMantissa =
      borrowCapsResult.status === 'fulfilled'
        ? new BigNumber(borrowCapsResult.value.toString())
        : undefined;

    if (!borrowCapsMantissa) {
      return;
    }

    const supplyCapsResult = supplyCapsResults[index];
    const supplyCapsMantissa =
      supplyCapsResult.status === 'fulfilled'
        ? new BigNumber(supplyCapsResult.value.toString())
        : undefined;

    if (!supplyCapsMantissa) {
      return;
    }

    const xvsBorrowSpeedResult = xvsBorrowSpeedResults[index];
    const xvsBorrowSpeedMantissa =
      xvsBorrowSpeedResult.status === 'fulfilled'
        ? new BigNumber(xvsBorrowSpeedResult.value.toString())
        : undefined;

    if (!xvsBorrowSpeedMantissa) {
      return;
    }

    const xvsSupplySpeedResult = xvsSupplySpeedResults[index];
    const xvsSupplySpeedMantissa =
      xvsSupplySpeedResult.status === 'fulfilled'
        ? new BigNumber(xvsSupplySpeedResult.value.toString())
        : undefined;

    if (!xvsSupplySpeedMantissa) {
      return;
    }

    const userVTokenBalancesResult = userVTokenBalances?.[index];

    const tokenPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: underlyingTokenPriceMantissa,
      decimals: underlyingToken.decimals,
    });

    const tokenPriceCents = convertDollarsToCents(tokenPriceDollars);

    const borrowCapTokens = convertMantissaToTokens({
      value: borrowCapsMantissa,
      token: vToken.underlyingToken,
    });

    const supplyCapTokens = convertMantissaToTokens({
      value: supplyCapsMantissa,
      token: vToken.underlyingToken,
    });

    const reserveFactor = convertFactorFromSmartContract({
      factor: new BigNumber(vTokenMetadata.reserveFactorMantissa.toString()),
    });

    const collateralFactor = convertFactorFromSmartContract({
      factor: new BigNumber(vTokenMetadata.collateralFactorMantissa.toString()),
    });

    const cashTokens = convertMantissaToTokens({
      value: new BigNumber(vTokenMetadata.totalCash.toString()),
      token: vToken.underlyingToken,
    });

    const liquidityCents = cashTokens.multipliedBy(tokenPriceCents);

    const reserveTokens = convertMantissaToTokens({
      value: new BigNumber(vTokenMetadata.totalReserves.toString()),
      token: vToken.underlyingToken,
    });

    const exchangeRateMantissa = new BigNumber(vTokenMetadata.exchangeRateCurrent.toString());

    const exchangeRateVTokens = exchangeRateMantissa.isEqualTo(0)
      ? new BigNumber(0)
      : new BigNumber(1).div(
          exchangeRateMantissa.div(
            10 ** (COMPOUND_DECIMALS + vToken.underlyingToken.decimals - vToken.decimals),
          ),
        );

    const supplyDailyPercentageRate = calculateDailyTokenRate({
      rateMantissa: new BigNumber(vTokenMetadata.supplyRatePerBlock.toString()),
      blocksPerDay,
    });

    const supplyApyPercentage = calculateYearlyPercentageRate({
      dailyPercentageRate: supplyDailyPercentageRate,
    });

    const borrowDailyPercentageRate = calculateDailyTokenRate({
      rateMantissa: new BigNumber(vTokenMetadata.borrowRatePerBlock.toString()),
      blocksPerDay,
    });

    const borrowApyPercentage = calculateYearlyPercentageRate({
      dailyPercentageRate: borrowDailyPercentageRate,
    });

    const supplyBalanceVTokens = convertMantissaToTokens({
      value: new BigNumber(vTokenMetadata.totalSupply.toString()),
      token: vToken,
    });
    const supplyBalanceTokens = supplyBalanceVTokens.div(exchangeRateVTokens);
    const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(tokenPriceDollars);
    const supplyBalanceCents = convertDollarsToCents(supplyBalanceDollars);

    const borrowBalanceTokens = convertMantissaToTokens({
      value: new BigNumber(vTokenMetadata.totalBorrows.toString()),
      token: vToken.underlyingToken,
    });
    const borrowBalanceDollars = borrowBalanceTokens.multipliedBy(tokenPriceDollars);
    const borrowBalanceCents = convertDollarsToCents(borrowBalanceDollars);

    const xvsPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: xvsPriceMantissa,
      decimals: xvs.decimals,
    });

    const borrowDistributions = formatDistributions({
      xvsSpeedMantissa: xvsBorrowSpeedMantissa,
      balanceDollars: borrowBalanceDollars,
      xvsPriceDollars,
      xvs,
      vToken,
      primeApy: primeApyMap.get(vToken.address)?.borrowApy,
      blocksPerDay,
    });

    const supplyDistributions = formatDistributions({
      xvsSpeedMantissa: xvsSupplySpeedMantissa,
      balanceDollars: supplyBalanceDollars,
      xvsPriceDollars,
      xvs,
      vToken,
      primeApy: primeApyMap.get(vToken.address)?.supplyApy,
      blocksPerDay,
    });

    const isCollateralOfUser = (userCollateralizedVTokenAddresses || []).includes(
      vTokenMetadata.vToken,
    );
    const userSupplyBalanceTokens = userVTokenBalancesResult?.balanceOfUnderlying
      ? convertMantissaToTokens({
          value: new BigNumber(userVTokenBalancesResult.balanceOfUnderlying.toString()),
          token: vToken.underlyingToken,
        })
      : new BigNumber(0);

    const userBorrowBalanceTokens = userVTokenBalancesResult?.balanceOfUnderlying
      ? convertMantissaToTokens({
          value: new BigNumber(userVTokenBalancesResult.borrowBalanceCurrent.toString()),
          token: vToken.underlyingToken,
        })
      : new BigNumber(0);

    const userSupplyBalanceCents = userSupplyBalanceTokens.multipliedBy(tokenPriceCents);
    const userBorrowBalanceCents = userBorrowBalanceTokens.multipliedBy(tokenPriceCents);

    const userWalletBalanceTokens = userVTokenBalancesResult?.tokenBalance
      ? convertMantissaToTokens({
          value: new BigNumber(userVTokenBalancesResult.tokenBalance.toString()),
          token: vToken.underlyingToken,
        })
      : new BigNumber(0);
    const userWalletBalanceCents = userWalletBalanceTokens.multipliedBy(tokenPriceCents);

    const market = (mainMarkets || []).find(mainMarket =>
      areAddressesEqual(mainMarket.address, vToken.address),
    );

    const disabledTokenActions = getDisabledTokenActions({
      bitmask: vTokenMetadata.pausedActions.toNumber(),
      tokenAddresses: [vToken.address, vToken.underlyingToken.address],
      chainId,
    });

    const asset: Asset = {
      vToken,
      disabledTokenActions,
      tokenPriceCents,
      reserveFactor,
      collateralFactor,
      liquidityCents,
      reserveTokens,
      cashTokens,
      borrowCapTokens,
      supplyCapTokens,
      exchangeRateVTokens,
      borrowApyPercentage,
      supplyApyPercentage,
      supplyBalanceTokens,
      supplyBalanceCents,
      borrowBalanceTokens,
      borrowBalanceCents,
      supplyDistributions,
      borrowDistributions,
      supplierCount: market?.supplierCount || 0,
      borrowerCount: market?.borrowerCount || 0,
      // User-specific props
      userSupplyBalanceTokens,
      userSupplyBalanceCents,
      userBorrowBalanceTokens,
      userBorrowBalanceCents,
      userWalletBalanceTokens,
      userWalletBalanceCents,
      // This will be calculated after all assets have been formatted
      userPercentOfLimit: 0,
      isCollateralOfUser,
    };

    assets.push(asset);
  });

  const pool: Pool = addUserPropsToPool({
    name,
    description,
    comptrollerAddress: comptrollerContractAddress,
    isIsolated: false,
    assets,
  });

  // Add user VAI loan to user borrow balance
  if (pool.userBorrowBalanceCents && userVaiBorrowBalanceMantissa) {
    const userVaiBorrowBalanceCents = convertMantissaToTokens({
      value: userVaiBorrowBalanceMantissa,
      token: vai,
    }) // Convert VAI to dollar cents (we assume 1 VAI = 1 dollar)
      .times(100);

    pool.userBorrowBalanceCents = pool.userBorrowBalanceCents.plus(userVaiBorrowBalanceCents);
  }

  // Calculate userPercentOfLimit for each asset
  const formattedAssets: Asset[] = assets.map(asset => ({
    ...asset,
    userPercentOfLimit:
      asset.userBorrowBalanceCents?.isGreaterThan(0) && pool.userBorrowLimitCents?.isGreaterThan(0)
        ? new BigNumber(asset.userBorrowBalanceCents)
            .times(100)
            .div(pool.userBorrowLimitCents)
            .dp(2)
            .toNumber()
        : 0,
  }));

  return {
    ...pool,
    assets: formattedAssets,
  };
};

export default formatToPool;
