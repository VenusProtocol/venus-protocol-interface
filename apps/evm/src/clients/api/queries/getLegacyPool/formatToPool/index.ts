import BigNumber from 'bignumber.js';

import type { GetTokenBalancesOutput } from 'clients/api';
import {
  BSC_MAINNET_UNLISTED_TOKEN_ADDRESSES,
  BSC_TESTNET_UNLISTED_TOKEN_ADDRESSES,
} from 'constants/address';
import { COMPOUND_DECIMALS, COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import MAX_UINT256 from 'constants/maxUint256';
import type { LegacyPoolComptroller, ResilientOracle, VenusLens } from 'libs/contracts';
import { logError } from 'libs/errors';
import {
  type Asset,
  ChainId,
  type Market,
  type Pool,
  type PrimeApy,
  type Token,
  type VToken,
} from 'types';
import {
  addUserPropsToPool,
  areAddressesEqual,
  areTokensEqual,
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
  vTokenMetaDataResults: Awaited<ReturnType<VenusLens['callStatic']['vTokenMetadataAll']>>;
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
  vTreasuryTokenBalances?: GetTokenBalancesOutput;
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
  vTokenMetaDataResults,
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
  vTreasuryTokenBalances,
}: FormatToPoolInput) => {
  const assets: Asset[] = [];

  vTokenMetaDataResults.forEach((vTokenMetaData, index) => {
    // Temporarily remove unlisted tokens that have not been updated from the contract side yet.
    // TODO: remove this logic once these tokens have been unlisted from contracts
    if (
      chainId === ChainId.BSC_MAINNET &&
      BSC_MAINNET_UNLISTED_TOKEN_ADDRESSES.some(unlistedTokenAddress =>
        areAddressesEqual(unlistedTokenAddress, vTokenMetaData.underlyingAssetAddress),
      )
    ) {
      return;
    }
    if (
      chainId === ChainId.BSC_TESTNET &&
      BSC_TESTNET_UNLISTED_TOKEN_ADDRESSES.some(unlistedTokenAddress =>
        areAddressesEqual(unlistedTokenAddress, vTokenMetaData.underlyingAssetAddress),
      )
    ) {
      return;
    }

    // Remove unlisted tokens
    if (!vTokenMetaData.isListed) {
      return;
    }

    const underlyingToken = findTokenByAddress({
      tokens,
      address: vTokenMetaData.underlyingAssetAddress,
    });

    if (!underlyingToken) {
      logError(`Record missing for token: ${vTokenMetaData.underlyingAssetAddress}`);
      return;
    }

    const vToken: VToken = {
      decimals: 8,
      address: vTokenMetaData.vToken,
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

    const unformattedBorrowCapTokens = convertMantissaToTokens({
      value: borrowCapsMantissa,
      token: vToken.underlyingToken,
    });

    const borrowCapTokens = unformattedBorrowCapTokens.isEqualTo(0)
      ? undefined
      : unformattedBorrowCapTokens;

    const unformattedSupplyCapTokens = convertMantissaToTokens({
      value: supplyCapsMantissa,
      token: vToken.underlyingToken,
    });

    const supplyCapTokens = unformattedSupplyCapTokens
      .multipliedBy(COMPOUND_MANTISSA)
      .isGreaterThanOrEqualTo(MAX_UINT256)
      ? undefined
      : unformattedSupplyCapTokens;

    const reserveFactor = convertFactorFromSmartContract({
      factor: new BigNumber(vTokenMetaData.reserveFactorMantissa.toString()),
    });

    const collateralFactor = convertFactorFromSmartContract({
      factor: new BigNumber(vTokenMetaData.collateralFactorMantissa.toString()),
    });

    const cashTokens = convertMantissaToTokens({
      value: new BigNumber(vTokenMetaData.totalCash.toString()),
      token: vToken.underlyingToken,
    });

    const liquidityCents = cashTokens.multipliedBy(tokenPriceCents);

    const treasuryTokenBalanceRes = vTreasuryTokenBalances?.tokenBalances.find(
      treasuryTokenBalance => areTokensEqual(treasuryTokenBalance.token, vToken.underlyingToken),
    );

    const reserveTokens = treasuryTokenBalanceRes?.balanceMantissa
      ? convertMantissaToTokens({
          value: new BigNumber(treasuryTokenBalanceRes?.balanceMantissa),
          token: vToken.underlyingToken,
        })
      : new BigNumber(0);

    const exchangeRateMantissa = new BigNumber(vTokenMetaData.exchangeRateCurrent.toString());

    const exchangeRateVTokens = exchangeRateMantissa.isEqualTo(0)
      ? new BigNumber(0)
      : new BigNumber(1).div(
          exchangeRateMantissa.div(
            10 ** (COMPOUND_DECIMALS + vToken.underlyingToken.decimals - vToken.decimals),
          ),
        );

    const supplyDailyPercentageRate = calculateDailyTokenRate({
      rateMantissa: new BigNumber(vTokenMetaData.supplyRatePerBlock.toString()),
      blocksPerDay,
    });

    const supplyApyPercentage = calculateYearlyPercentageRate({
      dailyPercentageRate: supplyDailyPercentageRate,
    });

    const borrowDailyPercentageRate = calculateDailyTokenRate({
      rateMantissa: new BigNumber(vTokenMetaData.borrowRatePerBlock.toString()),
      blocksPerDay,
    });

    const borrowApyPercentage = calculateYearlyPercentageRate({
      dailyPercentageRate: borrowDailyPercentageRate,
    });

    const supplyBalanceVTokens = convertMantissaToTokens({
      value: new BigNumber(vTokenMetaData.totalSupply.toString()),
      token: vToken,
    });
    const supplyBalanceTokens = supplyBalanceVTokens.div(exchangeRateVTokens);
    const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(tokenPriceDollars);
    const supplyBalanceCents = convertDollarsToCents(supplyBalanceDollars);

    const borrowBalanceTokens = convertMantissaToTokens({
      value: new BigNumber(vTokenMetaData.totalBorrows.toString()),
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
      vTokenMetaData.vToken,
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
      bitmask: vTokenMetaData.pausedActions.toNumber(),
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
