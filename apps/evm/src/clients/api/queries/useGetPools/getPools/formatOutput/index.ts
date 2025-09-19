import { chainMetadata } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import type { Asset, ChainId, EModeGroup, Pool, Token, TokenBalance } from 'types';
import {
  areAddressesEqual,
  areTokensEqual,
  convertDollarsToCents,
  convertFactorFromSmartContract,
  convertMantissaToTokens,
  convertPercentageFromSmartContract,
  convertPriceMantissaToDollars,
  getDisabledTokenActions,
  isPoolIsolated,
} from 'utilities';
import type { PrimeApy, VTokenBalance } from '../../types';
import type { ApiPool, ApiTokenPrice } from '../getApiPools';
import { formatDistributions } from './formatDistributions';
import { formatEModeGroups } from './formatEModeGroups';
import { formatVToken } from './formatVToken';

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
  isEModeFeatureEnabled: boolean;
  userPoolEModeGroupIdMapping: Record<Address, number>;
  userPrimeApyMap?: Map<string, PrimeApy>;
  userCollateralVTokenAddresses?: string[];
  userVTokenBalances?: VTokenBalance[];
  userTokenBalances?: TokenBalance[];
  userVaiBorrowBalanceMantissa?: BigNumber;
}) => {
  const pools: Pool[] = apiPools.map(apiPool => {
    const { blocksPerDay } = chainMetadata[chainId];

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
      chainId,
      tokens,
    });
    let userEModeGroup: EModeGroup | undefined;

    const userEModeGroupId = userPoolEModeGroupIdMapping[apiPool.address.toLowerCase() as Address];

    if (userEModeGroupId > 0) {
      // The pool at index 0 represents the pool itself without any E-mode group enabled, hence why
      // the index of the pool enabled by the user is the one returned by the contract minus 1
      userEModeGroup = eModeGroups[userEModeGroupId - 1];
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

      // Shape vToken
      const vToken = formatVToken({ apiMarket: market, chainId, tokens });

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

      let userCollateralFactor = collateralFactor;
      let isCollateralOfUser = !!userCollateralVTokenAddresses.some(address =>
        areAddressesEqual(address, vToken.address),
      );

      const liquidationThresholdPercentage = convertPercentageFromSmartContract(
        market.liquidationThresholdMantissa,
      );

      let userLiquidationThresholdPercentage = liquidationThresholdPercentage;

      const isBorrowable = market.isBorrowable;
      let isBorrowableByUser = isBorrowable;

      if (userEModeGroup) {
        const eModeAssetSettings = userEModeGroup.assetSettings.find(settings =>
          areTokensEqual(settings.vToken, vToken),
        );

        const userEModeGroupCollateralFactor = eModeAssetSettings?.collateralFactor;

        userCollateralFactor =
          userEModeGroupCollateralFactor ??
          // If user has enabled an E-mode group and that asset is not in it, then it doesn't count as a user collateral
          0;

        // If user has enabled an E-mode group and that asset is not in it, or is not borrowable in
        // it, then it can't be borrowed by the user
        isBorrowableByUser = eModeAssetSettings?.isBorrowable || false;

        userLiquidationThresholdPercentage =
          eModeAssetSettings?.liquidationThresholdPercentage ?? liquidationThresholdPercentage;

        isCollateralOfUser = isCollateralOfUser && userEModeGroupCollateralFactor !== undefined;
      }

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
    if (!isIsolated && vai && userVaiBorrowBalanceMantissa) {
      const userVaiBorrowBalanceCents = convertMantissaToTokens({
        value: userVaiBorrowBalanceMantissa,
        token: vai,
      })
        // Convert VAI to dollar cents (we assume 1 VAI = 1 dollar)
        .times(100);

      poolUserBorrowBalanceCents = poolUserBorrowBalanceCents.plus(userVaiBorrowBalanceCents);
    }

    const pool: Pool = {
      comptrollerAddress: apiPool.address,
      name: apiPool.name === 'Core' ? 'Core pool' : apiPool.name,
      isIsolated,
      assets,
      eModeGroups,
      userBorrowBalanceCents: poolUserBorrowBalanceCents,
      userSupplyBalanceCents: poolUserSupplyBalanceCents,
      userBorrowLimitCents: poolUserBorrowLimitCents,
      userLiquidationThresholdCents: poolUserLiquidationThresholdCents,
      userEModeGroup,
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
