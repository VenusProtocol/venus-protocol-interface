import { getBlockTimeByChainId, vTokens } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import { COMPOUND_DECIMALS, COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import type { Asset, ChainId, EModeGroup, Pool, PoolVai, Token, TokenBalance } from 'types';
import {
  addUserBorrowLimitShares,
  areAddressesEqual,
  areTokensEqual,
  calculateUserPoolValues,
  convertDollarsToCents,
  convertFactorFromSmartContract,
  convertMantissaToTokens,
  convertPercentageFromSmartContract,
  convertPriceMantissaToDollars,
  findTokenByAddress,
  getDisabledTokenActions,
  isPoolIsolated,
} from 'utilities';
import type { PrimeApy, VTokenBalance } from '../../types';
import type { ApiPool, ApiTokenPrice } from '../getApiPools';
import { formatDistributions } from './formatDistributions';
import { formatEModeGroups } from './formatEModeGroups';

export const formatOutput = ({
  apiPools,
  tokenPricesMapping,
  chainId,
  tokens,
  currentBlockNumber,
  isUserConnected,
  userPrimeApyMap,
  userVTokenBalances = [],
  userTokenBalances = [],
  userCollateralVTokenAddresses = [],
  userVaiBorrowBalanceMantissa,
  userPoolEModeGroupIdMapping,
  vaiRepayRateMantissa,
  vaiPriceMantissa,
}: {
  chainId: ChainId;
  tokens: Token[];
  tokenPricesMapping: Record<string, ApiTokenPrice[]>;
  currentBlockNumber: bigint;
  apiPools: ApiPool[];
  userPoolEModeGroupIdMapping: Record<Address, number>;
  isUserConnected: boolean;
  userPrimeApyMap?: Map<string, PrimeApy>;
  userCollateralVTokenAddresses?: string[];
  userVTokenBalances?: VTokenBalance[];
  userTokenBalances?: TokenBalance[];
  userVaiBorrowBalanceMantissa?: BigNumber;
  vaiRepayRateMantissa?: bigint;
  vaiPriceMantissa?: bigint;
}) => {
  const pools: Pool[] = apiPools.map(apiPool => {
    const { blocksPerDay } = getBlockTimeByChainId({ chainId }) ?? {};

    const isIsolated = isPoolIsolated({
      chainId,
      comptrollerAddress: apiPool.address,
    });

    const eModeGroups = formatEModeGroups({
      apiPool,
      vTokens: vTokens[chainId],
    });
    let userEModeGroup: EModeGroup | undefined;

    const userEModeGroupId = userPoolEModeGroupIdMapping[apiPool.address.toLowerCase() as Address];

    // The E-mode group with ID 0 corresponds to the pool itself
    if (userEModeGroupId > 0) {
      userEModeGroup = eModeGroups.find(e => e.id === userEModeGroupId);
    }

    const assets = apiPool.markets.reduce<Asset[]>((acc, market) => {
      // Remove unlisted tokens
      if (!market.isListed) {
        return acc;
      }

      // Get underlyingPriceMantissa from the tokens metadata
      const correspondingOraclePrice = tokenPricesMapping[
        market.underlyingAddress.toLowerCase()
      ].find(
        p =>
          p.priceOracleAddress &&
          areAddressesEqual(apiPool.priceOracleAddress, p.priceOracleAddress),
      );

      if (!correspondingOraclePrice) {
        return acc;
      }

      const vToken = findTokenByAddress({
        tokens: vTokens[chainId],
        address: market.address,
      });

      if (!vToken) {
        return acc;
      }

      const tokenPriceDollars = convertPriceMantissaToDollars({
        priceMantissa: correspondingOraclePrice.priceMantissa,
        decimals: vToken.underlyingToken.decimals,
      });

      const borrowCapTokens = convertMantissaToTokens({
        value: new BigNumber(market.borrowCapsMantissa),
        token: vToken.underlyingToken,
      });

      const supplyCapTokens = convertMantissaToTokens({
        value: new BigNumber(market.supplyCapsMantissa),
        token: vToken.underlyingToken,
      });

      const reserveFactor = convertFactorFromSmartContract({
        factor: new BigNumber(market.reserveFactorMantissa),
      });

      const collateralFactor = convertFactorFromSmartContract({
        factor: new BigNumber(market.collateralFactorMantissa),
      });

      const isCollateralOfUser = !!userCollateralVTokenAddresses.some(address =>
        areAddressesEqual(address, vToken.address),
      );

      const liquidationThresholdPercentage = convertPercentageFromSmartContract(
        market.liquidationThresholdMantissa,
      );

      const liquidationPenaltyPercentage = convertPercentageFromSmartContract(
        new BigNumber(market.liquidationIncentiveMantissa).minus(COMPOUND_MANTISSA),
      );

      const userEModeAssetSettings = userEModeGroup?.isActive
        ? userEModeGroup.assetSettings.find(settings => areTokensEqual(settings.vToken, vToken))
        : undefined;

      const isBorrowable = market.isBorrowable ?? true;
      let isBorrowableByUser = isBorrowable;

      if (userEModeGroup) {
        isBorrowableByUser = userEModeAssetSettings?.isBorrowable ?? false;
      }

      let userFallbackLiquidationThresholdPercentage = 0;
      let userFallbackCollateralFactor = 0;

      // If the user has enabled a non-isolated E-mode group and that asset is not in it, then it
      // contributes towards that user's borrow limit using the pool settings. If the E-mode group
      // enabled by the user is inactive, we also fallback to using the pool settings
      if (
        isUserConnected &&
        (!userEModeGroup || !userEModeGroup.isActive || !userEModeGroup.isIsolated)
      ) {
        userFallbackLiquidationThresholdPercentage = liquidationThresholdPercentage;
        userFallbackCollateralFactor = collateralFactor;
      }

      const userCollateralFactor =
        userEModeAssetSettings?.collateralFactor ?? userFallbackCollateralFactor;

      const userLiquidationThresholdPercentage =
        userEModeAssetSettings?.liquidationThresholdPercentage ??
        userFallbackLiquidationThresholdPercentage;

      const cashTokens = convertMantissaToTokens({
        value: new BigNumber(market.cashMantissa),
        token: vToken.underlyingToken,
      });

      const tokenPriceCents = convertDollarsToCents(tokenPriceDollars);
      const liquidityCents = cashTokens.multipliedBy(tokenPriceCents);

      const reserveTokens = convertMantissaToTokens({
        value: new BigNumber(market.totalReservesMantissa),
        token: vToken.underlyingToken,
      });

      const exchangeRateVTokens = new BigNumber(1).div(
        new BigNumber(market.exchangeRateMantissa).div(
          10 ** (COMPOUND_DECIMALS + vToken.underlyingToken.decimals - vToken.decimals),
        ),
      );

      const supplyBalanceVTokens = convertMantissaToTokens({
        value: new BigNumber(market.totalSupplyMantissa),
        token: vToken,
      });
      const supplyBalanceTokens = supplyBalanceVTokens.div(exchangeRateVTokens);
      const supplyBalanceCents = supplyBalanceTokens.multipliedBy(tokenPriceCents);

      const borrowBalanceTokens = convertMantissaToTokens({
        value: new BigNumber(market.totalBorrowsMantissa),
        token: vToken.underlyingToken,
      });

      const borrowBalanceCents = borrowBalanceTokens.multipliedBy(tokenPriceCents);

      const {
        supplyTokenDistributions,
        supplyPointDistributions,
        borrowTokenDistributions,
        borrowPointDistributions,
      } = formatDistributions({
        blocksPerDay,
        tokenPricesMapping,
        underlyingToken: vToken.underlyingToken,
        underlyingTokenPriceDollars: tokenPriceDollars,
        primeApy: userPrimeApyMap?.get(vToken.address),
        tokens,
        supplyBalanceTokens,
        borrowBalanceTokens,
        currentBlockNumber,
        apiRewardsDistributors: market.rewardsDistributors,
        apiPointsDistributions: market.pointsDistributions,
      });

      const disabledTokenActions = getDisabledTokenActions({
        bitmask: market.pausedActionsBitmap,
        tokenAddresses: [vToken.address, vToken.underlyingToken.address],
        chainId,
      });

      // User-specific props
      const userVTokenBalance = userVTokenBalances.find(tokenBalance =>
        areAddressesEqual(tokenBalance.vTokenAddress, vToken.address),
      );

      const userBorrowBalanceTokens = userVTokenBalance
        ? convertMantissaToTokens({
            value: userVTokenBalance.underlyingTokenBorrowBalanceMantissa,
            token: vToken.underlyingToken,
          })
        : new BigNumber(0);

      const userSupplyBalanceTokens = userVTokenBalance
        ? convertMantissaToTokens({
            value: userVTokenBalance.underlyingTokenSupplyBalanceMantissa,
            token: vToken.underlyingToken,
          })
        : new BigNumber(0);

      const userTokenBalance = userTokenBalances.find(tokenBalance =>
        areTokensEqual(tokenBalance.token, vToken.underlyingToken),
      );

      const userWalletBalanceTokens = userTokenBalance
        ? convertMantissaToTokens({
            value: userTokenBalance.balanceMantissa,
            token: userTokenBalance.token,
          })
        : new BigNumber(0);

      const userSupplyBalanceCents = userSupplyBalanceTokens.multipliedBy(tokenPriceCents);
      const userBorrowBalanceCents = userBorrowBalanceTokens.multipliedBy(tokenPriceCents);
      const userWalletBalanceCents = userWalletBalanceTokens.multipliedBy(tokenPriceCents);

      const asset: Asset = {
        vToken,
        disabledTokenActions,
        tokenPriceCents,
        tokenPriceOracleAddress:
          correspondingOraclePrice.priceOracleAddress ?? correspondingOraclePrice.mainOracleAddress,
        reserveFactor,
        collateralFactor,
        liquidationThresholdPercentage,
        liquidationPenaltyPercentage,
        cashTokens,
        liquidityCents,
        reserveTokens,
        exchangeRateVTokens,
        badDebtMantissa: BigInt(market.badDebtMantissa),
        supplierCount: market.supplierCount || 0,
        borrowerCount: market.borrowerCount || 0,
        borrowApyPercentage: new BigNumber(market.borrowApy),
        supplyApyPercentage: new BigNumber(market.supplyApy),
        supplyBalanceTokens,
        supplyBalanceCents,
        borrowBalanceTokens,
        borrowBalanceCents,
        borrowCapTokens,
        supplyCapTokens,
        supplyTokenDistributions,
        borrowTokenDistributions,
        supplyPointDistributions,
        borrowPointDistributions,
        userSupplyBalanceTokens,
        userSupplyBalanceCents,
        userBorrowBalanceTokens,
        userBorrowBalanceCents,
        userWalletBalanceTokens,
        userWalletBalanceCents,
        userCollateralFactor,
        userLiquidationThresholdPercentage,
        isBorrowable,
        isBorrowableByUser,
        // This will be calculated after all assets have been formatted
        userBorrowLimitSharePercentage: 0,
        isCollateralOfUser,
      };

      return [...acc, asset];
    }, []);

    // Calculate user VAI loan (only applies to legacy pool)
    const vai = tokens.find(token => token.symbol === 'VAI');
    let poolVai: undefined | PoolVai;

    if (!isIsolated && vai && vaiPriceMantissa && vaiRepayRateMantissa) {
      const vaiBorrowAprPercentage = new BigNumber(
        convertPercentageFromSmartContract(vaiRepayRateMantissa.toString()),
      );

      const vaiPriceUsd = convertPriceMantissaToDollars({
        priceMantissa: vaiPriceMantissa.toString(),
        decimals: vai.decimals,
      });

      const vaiPriceCents = convertDollarsToCents(vaiPriceUsd);

      poolVai = {
        token: vai,
        tokenPriceCents: vaiPriceCents,
        borrowAprPercentage: vaiBorrowAprPercentage,
      };
    }

    if (!isIsolated && poolVai?.tokenPriceCents && userVaiBorrowBalanceMantissa) {
      const userVaiBorrowBalanceTokens = convertMantissaToTokens({
        value: userVaiBorrowBalanceMantissa,
        token: vai,
      });

      poolVai.userBorrowBalanceTokens = userVaiBorrowBalanceTokens;
      poolVai.userBorrowBalanceCents = userVaiBorrowBalanceTokens.multipliedBy(
        poolVai.tokenPriceCents,
      );
    }

    const userPoolValues = calculateUserPoolValues({
      assets,
      userVaiBorrowBalanceCents: poolVai?.userBorrowBalanceCents,
      vaiBorrowAprPercentage: poolVai?.borrowAprPercentage,
    });

    // Calculate userBorrowLimitSharePercentage for each asset
    const { assets: formattedAssets } = addUserBorrowLimitShares({
      assets,
      userBorrowLimitCents: userPoolValues.userBorrowLimitCents,
    });

    const pool: Pool = {
      ...userPoolValues,
      comptrollerAddress: apiPool.address,
      name: apiPool.name === 'Core' ? 'Core pool' : apiPool.name,
      isIsolated,
      eModeGroups,
      userEModeGroup,
      vai: poolVai,
      assets: formattedAssets,
    };

    return pool;
  });

  return pools;
};
