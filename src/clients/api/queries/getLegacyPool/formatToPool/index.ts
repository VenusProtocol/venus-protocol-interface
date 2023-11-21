import BigNumber from 'bignumber.js';
import { logError } from 'packages/errors';
import { LegacyPoolComptroller, ResilientOracle, VenusLens } from 'packages/contracts';
import { Asset, Market, Pool, Token, VToken } from 'types';
import {
  addUserPropsToPool,
  areAddressesEqual,
  calculateApy,
  convertDollarsToCents,
  convertFactorFromSmartContract,
  convertMantissaToTokens,
  convertPriceMantissaToDollars,
  multiplyMantissaDaily,
} from 'utilities';

import { BSC_MAINNET_CAN_ADDRESS } from 'constants/address';
import { COMPOUND_DECIMALS, COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import MAX_UINT256 from 'constants/maxUint256';
import findTokenByAddress from 'utilities/findTokenByAddress';

import { PrimeApy } from '../types';
import { formatDistributions } from './formatDistributions';

export interface FormatToPoolInput {
  blocksPerDay: number;
  name: string;
  xvs: Token;
  vai: Token;
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
  userCollateralizedVTokenAddresses?: string[];
  userVTokenBalances?: Awaited<ReturnType<VenusLens['callStatic']['vTokenBalancesAll']>>;
  userVaiBorrowBalanceMantissa?: BigNumber;
  mainMarkets?: Market[];
}

export const formatToPool = ({
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
}: FormatToPoolInput) => {
  const assets: Asset[] = [];

  vTokenMetaDataResults.forEach((vTokenMetaData, index) => {
    // Temporary workaround to filter out CAN
    if (areAddressesEqual(vTokenMetaData.underlyingAssetAddress, BSC_MAINNET_CAN_ADDRESS)) {
      // TODO: remove once a more generic solution has been integrated on the contract side
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
      logError(
        `Price could not be fetched for token: ${underlyingToken.symbol} ${underlyingToken.address}`,
      );
      return;
    }

    const borrowCapsResult = borrowCapsResults[index];
    const borrowCapsMantissa =
      borrowCapsResult.status === 'fulfilled'
        ? new BigNumber(borrowCapsResult.value.toString())
        : undefined;

    if (!borrowCapsMantissa) {
      logError(`Borrow cap could not be fetched for vToken: ${vToken.symbol} ${vToken.address}`);
      return;
    }

    const supplyCapsResult = supplyCapsResults[index];
    const supplyCapsMantissa =
      supplyCapsResult.status === 'fulfilled'
        ? new BigNumber(supplyCapsResult.value.toString())
        : undefined;

    if (!supplyCapsMantissa) {
      logError(`Supply cap could not be fetched for vToken: ${vToken.symbol} ${vToken.address}`);
      return;
    }

    const xvsBorrowSpeedResult = xvsBorrowSpeedResults[index];
    const xvsBorrowSpeedMantissa =
      xvsBorrowSpeedResult.status === 'fulfilled'
        ? new BigNumber(xvsBorrowSpeedResult.value.toString())
        : undefined;

    if (!xvsBorrowSpeedMantissa) {
      logError(
        `XVS Borrow speed could not be fetched for vToken: ${vToken.symbol} ${vToken.address}`,
      );
      return;
    }

    const xvsSupplySpeedResult = xvsSupplySpeedResults[index];
    const xvsSupplySpeedMantissa =
      xvsSupplySpeedResult.status === 'fulfilled'
        ? new BigNumber(xvsSupplySpeedResult.value.toString())
        : undefined;

    if (!xvsSupplySpeedMantissa) {
      logError(
        `XVS Supply speed could not be fetched for vToken: ${vToken.symbol} ${vToken.address}`,
      );
      return;
    }

    const userVTokenBalancesResult = userVTokenBalances?.[index];

    const tokenPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: underlyingTokenPriceMantissa,
      token: underlyingToken,
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

    const reserveTokens = convertMantissaToTokens({
      value: new BigNumber(vTokenMetaData.totalReserves.toString()),
      token: vToken.underlyingToken,
    });

    const exchangeRateMantissa = new BigNumber(vTokenMetaData.exchangeRateCurrent.toString());

    const exchangeRateVTokens = exchangeRateMantissa.isEqualTo(0)
      ? new BigNumber(0)
      : new BigNumber(1).div(
          exchangeRateMantissa.div(
            10 ** (COMPOUND_DECIMALS + vToken.underlyingToken.decimals - vToken.decimals),
          ),
        );

    const supplyDailyPercentageRate = multiplyMantissaDaily({
      mantissa: new BigNumber(vTokenMetaData.supplyRatePerBlock.toString()),
      blocksPerDay,
    });

    const supplyApyPercentage = calculateApy({
      dailyRate: supplyDailyPercentageRate,
    });

    const borrowDailyPercentageRate = multiplyMantissaDaily({
      mantissa: new BigNumber(vTokenMetaData.borrowRatePerBlock.toString()),
      blocksPerDay,
    });

    const borrowApyPercentage = calculateApy({
      dailyRate: borrowDailyPercentageRate,
    });

    const supplyPercentageRatePerBlock = supplyDailyPercentageRate.dividedBy(blocksPerDay);
    const borrowPercentageRatePerBlock = borrowDailyPercentageRate.dividedBy(blocksPerDay);

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
      token: xvs,
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

    const asset: Asset = {
      vToken,
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
      supplyPercentageRatePerBlock,
      borrowPercentageRatePerBlock,
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
