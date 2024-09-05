import BigNumber from 'bignumber.js';

import { NATIVE_TOKEN_ADDRESS, NULL_ADDRESS } from 'constants/address';
import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import type { VenusLens } from 'libs/contracts';
import type { Asset, ChainId, Market, Pool, PrimeApy, Token, VToken } from 'types';
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
  legacyPoolMarkets: Market[];
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
  legacyPoolMarkets,
  xvsPriceMantissa,
  userCollateralizedVTokenAddresses,
  userVTokenBalances,
  userVaiBorrowBalanceMantissa,
  primeApyMap,
  mainMarkets,
}: FormatToPoolInput) => {
  const assets: Asset[] = [];

  legacyPoolMarkets.forEach((legacyPoolMarket, index) => {
    const underlyingTokenAddress =
      // If underlying asset address is the null address, this means the VToken has no underlying
      // token because it is a native token
      areAddressesEqual(legacyPoolMarket.underlyingTokenAddress, NULL_ADDRESS)
        ? NATIVE_TOKEN_ADDRESS
        : legacyPoolMarket.underlyingTokenAddress;

    const underlyingToken = findTokenByAddress({
      tokens,
      address: underlyingTokenAddress,
    });

    if (!underlyingToken) {
      return;
    }

    const vToken: VToken = {
      decimals: 8,
      address: legacyPoolMarket.vTokenAddress,
      symbol: `v${underlyingToken.symbol}`,
      underlyingToken,
    };

    const {
      underlyingTokenPriceMantissa,
      borrowCapsMantissa,
      supplyCapsMantissa,
      exchangeRateMantissa,
      supplyRatePerBlock,
      borrowRatePerBlock,
      totalSupplyMantissa,
      totalBorrowsMantissa,
    } = legacyPoolMarket;

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
      factor: legacyPoolMarket.reserveFactorMantissa,
    });

    const collateralFactor = convertFactorFromSmartContract({
      factor: legacyPoolMarket.collateralFactorMantissa,
    });

    const cashTokens = convertMantissaToTokens({
      value: legacyPoolMarket.cashMantissa,
      token: vToken.underlyingToken,
    });

    const liquidityCents = cashTokens.multipliedBy(tokenPriceCents);

    const reserveTokens = convertMantissaToTokens({
      value: legacyPoolMarket.totalReservesMantissa,
      token: vToken.underlyingToken,
    });

    const exchangeRateVTokens = exchangeRateMantissa.isEqualTo(0)
      ? new BigNumber(0)
      : new BigNumber(1).div(
          exchangeRateMantissa.div(
            10 ** (COMPOUND_DECIMALS + vToken.underlyingToken.decimals - vToken.decimals),
          ),
        );

    const supplyDailyPercentageRate = calculateDailyTokenRate({
      rateMantissa: supplyRatePerBlock,
      blocksPerDay,
    });

    const supplyApyPercentage = calculateYearlyPercentageRate({
      dailyPercentageRate: supplyDailyPercentageRate,
    });

    const borrowDailyPercentageRate = calculateDailyTokenRate({
      rateMantissa: borrowRatePerBlock,
      blocksPerDay,
    });

    const borrowApyPercentage = calculateYearlyPercentageRate({
      dailyPercentageRate: borrowDailyPercentageRate,
    });

    const supplyBalanceVTokens = convertMantissaToTokens({
      value: totalSupplyMantissa,
      token: vToken,
    });
    const supplyBalanceTokens = supplyBalanceVTokens.div(exchangeRateVTokens);
    const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(tokenPriceDollars);
    const supplyBalanceCents = convertDollarsToCents(supplyBalanceDollars);

    const borrowBalanceTokens = convertMantissaToTokens({
      value: totalBorrowsMantissa,
      token: vToken.underlyingToken,
    });
    const borrowBalanceDollars = borrowBalanceTokens.multipliedBy(tokenPriceDollars);
    const borrowBalanceCents = convertDollarsToCents(borrowBalanceDollars);

    const xvsPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: xvsPriceMantissa,
      decimals: xvs.decimals,
    });

    // the legacy pool markets only have a single reward: XVS
    const borrowDistributions = formatDistributions({
      xvsSpeedMantissa: legacyPoolMarket.rewardsDistributors[0].borrowSpeed,
      balanceDollars: borrowBalanceDollars,
      xvsPriceDollars,
      xvs,
      vToken,
      primeApy: primeApyMap.get(vToken.address)?.borrowApy,
      blocksPerDay,
    });

    // the legacy pool markets only have a single reward: XVS
    const supplyDistributions = formatDistributions({
      xvsSpeedMantissa: legacyPoolMarket.rewardsDistributors[0].supplySpeed,
      balanceDollars: supplyBalanceDollars,
      xvsPriceDollars,
      xvs,
      vToken,
      primeApy: primeApyMap.get(vToken.address)?.supplyApy,
      blocksPerDay,
    });

    const isCollateralOfUser = (userCollateralizedVTokenAddresses || []).includes(
      legacyPoolMarket.vTokenAddress,
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
      areAddressesEqual(mainMarket.vTokenAddress, vToken.address),
    );

    const disabledTokenActions = getDisabledTokenActions({
      bitmask: legacyPoolMarket.pausedActionsBitmap,
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
