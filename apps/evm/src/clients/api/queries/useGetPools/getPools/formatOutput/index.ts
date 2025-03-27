import { chainMetadata } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';

import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import { getVTokenAsset } from 'libs/tokens';
import type { Asset, ChainId, Pool, Token, TokenBalance, VToken } from 'types';
import {
  areAddressesEqual,
  areTokensEqual,
  convertDollarsToCents,
  convertFactorFromSmartContract,
  convertMantissaToTokens,
  convertPriceMantissaToDollars,
  findTokenByAddress,
  getDisabledTokenActions,
  isPoolIsolated,
} from 'utilities';
import type { PrimeApy, VTokenBalance } from '../../types';
import type { ApiPool } from '../getApiPools';
import { formatDistributions } from './formatDistributions';

export const formatOutput = ({
  apiPools,
  chainId,
  tokens,
  currentBlockNumber,
  userPrimeApyMap,
  userVTokenBalances = [],
  userTokenBalances = [],
  userCollateralVTokenAddresses = [],
  userVaiBorrowBalanceMantissa,
}: {
  chainId: ChainId;
  tokens: Token[];
  currentBlockNumber: bigint;
  apiPools: ApiPool[];
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

    const assets = apiPool.markets.reduce<Asset[]>((acc, market) => {
      // Remove unlisted tokens
      if (!market.isListed) {
        return acc;
      }

      // Retrieve underlying token record
      const underlyingToken = findTokenByAddress({
        tokens,
        address: market.underlyingAddress || NATIVE_TOKEN_ADDRESS,
      });

      if (!underlyingToken) {
        return acc;
      }

      const tokenPriceDollars = convertPriceMantissaToDollars({
        priceMantissa: market.underlyingPriceMantissa,
        decimals: underlyingToken.decimals,
      });

      // Shape vToken
      const vToken: VToken = {
        address: market.address,
        asset: getVTokenAsset({ vTokenAddress: market.address, chainId }),
        decimals: 8,
        symbol: `v${underlyingToken.symbol}`,
        underlyingToken,
      };

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

      const isCollateralOfUser = !!userCollateralVTokenAddresses.some(address =>
        areAddressesEqual(address, vToken.address),
      );

      poolUserBorrowBalanceCents = poolUserBorrowBalanceCents.plus(userBorrowBalanceCents);
      poolUserSupplyBalanceCents = poolUserSupplyBalanceCents.plus(userSupplyBalanceCents);

      if (isCollateralOfUser) {
        poolUserBorrowLimitCents = (poolUserBorrowLimitCents || new BigNumber(0)).plus(
          userSupplyBalanceCents.times(collateralFactor),
        );
      }

      const asset: Asset = {
        vToken,
        disabledTokenActions,
        tokenPriceCents,
        reserveFactor,
        collateralFactor,
        cashTokens,
        liquidityCents,
        reserveTokens,
        exchangeRateVTokens,
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
      name: apiPool.name,
      isIsolated,
      assets,
      userBorrowBalanceCents: poolUserBorrowBalanceCents,
      userSupplyBalanceCents: poolUserSupplyBalanceCents,
      userBorrowLimitCents: poolUserBorrowLimitCents,
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
