import { chains, vTokens } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import { COMPOUND_DECIMALS, COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import type { Asset, ChainId, EModeGroup, Pool, Token, TokenBalance } from 'types';
import {
  areAddressesEqual,
  areTokensEqual,
  calculateHealthFactor,
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
  userPrimeApyMap,
  userVTokenBalances = [],
  userTokenBalances = [],
  userCollateralVTokenAddresses = [],
  userVaiBorrowBalanceMantissa,
  userPoolEModeGroupIdMapping,
}: {
  chainId: ChainId;
  tokens: Token[];
  tokenPricesMapping: Record<string, ApiTokenPrice[]>;
  currentBlockNumber: bigint;
  apiPools: ApiPool[];
  userPoolEModeGroupIdMapping: Record<Address, number>;
  userPrimeApyMap?: Map<string, PrimeApy>;
  userCollateralVTokenAddresses?: string[];
  userVTokenBalances?: VTokenBalance[];
  userTokenBalances?: TokenBalance[];
  userVaiBorrowBalanceMantissa?: BigNumber;
}) => {
  const pools: Pool[] = apiPools.map(apiPool => {
    const { blocksPerDay } = chains[chainId];

    const isIsolated = isPoolIsolated({
      chainId,
      comptrollerAddress: apiPool.address,
    });

    let poolUserBorrowBalanceCents = new BigNumber(0);
    let poolUserSupplyBalanceCents = new BigNumber(0);
    let poolUserBorrowLimitCents = new BigNumber(0);
    let poolUserLiquidationThresholdCents = new BigNumber(0);

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

      // If the user has enabled a non-isolated E-mode group and that asset is not in it, then it
      // contributes towards that user's borrow limit using the pool settings. If the E-mode group
      // enabled by the user is inactive, we also fallback to using the pool settings
      let userFallbackLiquidationThresholdPercentage = liquidationThresholdPercentage;
      let userFallbackCollateralFactor = collateralFactor;

      // If the user has enabled an isolated E-mode group and that asset is not in it, then it does
      // not contribute towards that user's borrow limit
      if (userEModeGroup?.isActive && userEModeGroup.isIsolated) {
        userFallbackLiquidationThresholdPercentage = 0;
        userFallbackCollateralFactor = 0;
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

      poolUserBorrowBalanceCents = poolUserBorrowBalanceCents.plus(userBorrowBalanceCents);
      poolUserSupplyBalanceCents = poolUserSupplyBalanceCents.plus(userSupplyBalanceCents);

      if (isCollateralOfUser) {
        poolUserBorrowLimitCents = poolUserBorrowLimitCents.plus(
          userSupplyBalanceCents.times(userCollateralFactor),
        );

        poolUserLiquidationThresholdCents = poolUserLiquidationThresholdCents.plus(
          userSupplyBalanceCents.times(userLiquidationThresholdPercentage / 100),
        );
      }

      const asset: Asset = {
        vToken,
        disabledTokenActions,
        tokenPriceCents,
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
        userPercentOfLimit: 0,
        isCollateralOfUser,
      };

      return [...acc, asset];
    }, []);

    // Add user VAI loan to user borrow balance (only applies to legacy pool)
    const vai = tokens.find(token => token.symbol === 'VAI');
    let userVaiBorrowBalanceTokens: undefined | BigNumber;
    let userVaiBorrowBalanceCents: undefined | BigNumber;

    if (!isIsolated && vai && userVaiBorrowBalanceMantissa) {
      userVaiBorrowBalanceTokens = convertMantissaToTokens({
        value: userVaiBorrowBalanceMantissa,
        token: vai,
      });

      // Convert VAI to dollar cents (we assume 1 VAI = 1 dollar)
      userVaiBorrowBalanceCents = userVaiBorrowBalanceTokens.times(100);

      poolUserBorrowBalanceCents = poolUserBorrowBalanceCents.plus(userVaiBorrowBalanceCents);
    }

    const userHealthFactor = calculateHealthFactor({
      liquidationThresholdCents: poolUserLiquidationThresholdCents.toNumber(),
      borrowBalanceCents: poolUserBorrowBalanceCents.toNumber(),
    });

    const pool: Pool = {
      comptrollerAddress: apiPool.address,
      name: apiPool.name === 'Core' ? 'Core pool' : apiPool.name,
      isIsolated,
      assets,
      eModeGroups,
      userBorrowBalanceCents: poolUserBorrowBalanceCents,
      userSupplyBalanceCents: poolUserSupplyBalanceCents,
      userBorrowLimitCents: poolUserBorrowLimitCents,
      userVaiBorrowBalanceTokens,
      userVaiBorrowBalanceCents,
      userLiquidationThresholdCents: poolUserLiquidationThresholdCents,
      userEModeGroup,
      userHealthFactor,
    };

    // Calculate userPercentOfLimit for each asset
    const formattedAssets: Asset[] = assets.map(asset => ({
      ...asset,
      userPercentOfLimit:
        asset.userBorrowBalanceCents?.isGreaterThan(0) &&
        pool.userBorrowLimitCents?.isGreaterThan(0)
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
  });

  return pools;
};
