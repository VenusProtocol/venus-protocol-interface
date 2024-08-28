import BigNumber from 'bignumber.js';

import type { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import type { PoolLens } from 'libs/contracts';
import type { Asset, ChainId, Pool, PrimeApy, Token, VToken } from 'types';
import addUserPropsToPool from 'utilities/addUserPropsToPool';
import areAddressesEqual from 'utilities/areAddressesEqual';
import areTokensEqual from 'utilities/areTokensEqual';
import { calculateDailyTokenRate } from 'utilities/calculateDailyTokenRate';
import { calculateYearlyPercentageRate } from 'utilities/calculateYearlyPercentageRate';
import convertDollarsToCents from 'utilities/convertDollarsToCents';
import convertFactorFromSmartContract from 'utilities/convertFactorFromSmartContract';
import convertMantissaToTokens from 'utilities/convertMantissaToTokens';
import findTokenByAddress from 'utilities/findTokenByAddress';
import { getDisabledTokenActions } from 'utilities/getDisabledTokenActions';

import { NATIVE_TOKEN_ADDRESS, NULL_ADDRESS } from 'constants/address';
import type { GetApiPoolsOutput } from '../../getApiPools';
import type { GetTokenBalancesOutput } from '../../getTokenBalances';
import type { GetRewardsDistributorSettingsMappingOutput } from '../getRewardsDistributorSettingsMapping';
import type { GetTokenPriceDollarsMappingOutput } from '../getTokenPriceDollarsMapping';
import formatDistributions from './formatDistributions';

export interface FormatToPoolsInput {
  chainId: ChainId;
  tokens: Token[];
  currentBlockNumber: number;
  pools: GetApiPoolsOutput['pools'];
  rewardsDistributorSettingsMapping: GetRewardsDistributorSettingsMappingOutput;
  tokenPriceDollarsMapping: GetTokenPriceDollarsMappingOutput;
  primeApyMap: Map<string, PrimeApy>;
  userCollateralizedVTokenAddresses: string[];
  blocksPerDay?: number;
  poolParticipantsCountResult?: Awaited<ReturnType<typeof getIsolatedPoolParticipantsCount>>;
  userVTokenBalancesAll?: Awaited<ReturnType<PoolLens['callStatic']['vTokenBalancesAll']>>;
  userTokenBalancesAll?: GetTokenBalancesOutput;
}

const formatToPools = ({
  chainId,
  tokens,
  blocksPerDay,
  currentBlockNumber,
  pools,
  rewardsDistributorSettingsMapping,
  tokenPriceDollarsMapping,
  poolParticipantsCountResult,
  userCollateralizedVTokenAddresses,
  primeApyMap,
  userVTokenBalancesAll,
  userTokenBalancesAll,
}: FormatToPoolsInput) => {
  const formattedPools: Pool[] = pools.map(p => {
    const subgraphPool = poolParticipantsCountResult?.pools.find(pool =>
      areAddressesEqual(pool.id, p.address),
    );

    const assets = p.markets.reduce<Asset[]>((acc, market) => {
      // Remove unlisted tokens
      if (!market.isListed) {
        return acc;
      }

      const underlyingTokenAddress =
        // If underlying asset address is the null address, this means the VToken has no underlying
        // token because it is a native token
        areAddressesEqual(market.underlyingAddress, NULL_ADDRESS)
          ? NATIVE_TOKEN_ADDRESS
          : market.underlyingAddress;

      // Retrieve underlying token record
      const underlyingToken = findTokenByAddress({
        tokens,
        address: underlyingTokenAddress,
      });

      if (!underlyingToken) {
        return acc;
      }

      const tokenPriceDollars = tokenPriceDollarsMapping[underlyingToken.address.toLowerCase()];

      if (!tokenPriceDollars) {
        return acc;
      }

      // Shape vToken
      const vToken: VToken = {
        address: market.address,
        decimals: 8,
        symbol: `v${underlyingToken.symbol}`,
        underlyingToken,
      };

      const userVTokenBalances = userVTokenBalancesAll?.find(userBalances =>
        areAddressesEqual(userBalances.vToken, vToken.address),
      );

      // Extract supplierCount and borrowerCount from subgraph result
      const subgraphPoolMarket = subgraphPool?.markets.find(market =>
        areAddressesEqual(market.id, vToken.address),
      );
      const supplierCount = +(subgraphPoolMarket?.supplierCount || 0);
      const borrowerCount = +(subgraphPoolMarket?.borrowerCount || 0);

      const borrowCapTokens = convertMantissaToTokens({
        value: market.borrowCapsMantissa,
        token: vToken.underlyingToken,
      });

      const supplyCapTokens = convertMantissaToTokens({
        value: market.supplyCapsMantissa,
        token: vToken.underlyingToken,
      });

      const reserveFactor = convertFactorFromSmartContract({
        factor: market.reserveFactorMantissa,
      });

      const collateralFactor = convertFactorFromSmartContract({
        factor: market.collateralFactorMantissa,
      });

      const cashTokens = convertMantissaToTokens({
        value: market.cashMantissa,
        token: vToken.underlyingToken,
      });

      const tokenPriceCents = convertDollarsToCents(tokenPriceDollars);
      const liquidityCents = cashTokens.multipliedBy(tokenPriceCents);

      const reserveTokens = convertMantissaToTokens({
        value: market.totalReservesMantissa,
        token: vToken.underlyingToken,
      });

      const exchangeRateVTokens = new BigNumber(1).div(
        market.exchangeRateMantissa.div(
          10 ** (COMPOUND_DECIMALS + vToken.underlyingToken.decimals - vToken.decimals),
        ),
      );

      const supplyDailyPercentageRate = calculateDailyTokenRate({
        rateMantissa: market.supplyRatePerBlock,
        blocksPerDay,
      });

      const supplyApyPercentage = calculateYearlyPercentageRate({
        dailyPercentageRate: supplyDailyPercentageRate,
      });

      const borrowDailyPercentageRate = calculateDailyTokenRate({
        rateMantissa: market.borrowRatePerBlock,
        blocksPerDay,
      });

      const borrowApyPercentage = calculateYearlyPercentageRate({
        dailyPercentageRate: borrowDailyPercentageRate,
      });

      const supplyBalanceVTokens = convertMantissaToTokens({
        value: market.totalSupplyMantissa,
        token: vToken,
      });
      const supplyBalanceTokens = supplyBalanceVTokens.div(exchangeRateVTokens);
      const supplyBalanceCents = supplyBalanceTokens.multipliedBy(tokenPriceCents);

      const borrowBalanceTokens = convertMantissaToTokens({
        value: market.totalBorrowsMantissa,
        token: vToken.underlyingToken,
      });

      const borrowBalanceCents = borrowBalanceTokens.multipliedBy(tokenPriceCents);

      // User-specific props
      const userBorrowBalanceTokens = userVTokenBalances
        ? convertMantissaToTokens({
            value: new BigNumber(userVTokenBalances.borrowBalanceCurrent.toString()),
            token: vToken.underlyingToken,
          })
        : new BigNumber(0);

      const userSupplyBalanceTokens = userVTokenBalances
        ? convertMantissaToTokens({
            value: new BigNumber(userVTokenBalances.balanceOfUnderlying.toString()),
            token: vToken.underlyingToken,
          })
        : new BigNumber(0);

      const tokenBalanceRes = userTokenBalancesAll?.tokenBalances.find(tokenBalance =>
        areTokensEqual(tokenBalance.token, vToken.underlyingToken),
      );

      const userWalletBalanceTokens = tokenBalanceRes
        ? convertMantissaToTokens({
            value: tokenBalanceRes.balanceMantissa,
            token: tokenBalanceRes.token,
          })
        : new BigNumber(0);

      const userSupplyBalanceCents = userSupplyBalanceTokens.multipliedBy(tokenPriceCents);
      const userBorrowBalanceCents = userBorrowBalanceTokens.multipliedBy(tokenPriceCents);
      const userWalletBalanceCents = userWalletBalanceTokens.multipliedBy(tokenPriceCents);

      const isCollateralOfUser = !!userCollateralizedVTokenAddresses.some(address =>
        areAddressesEqual(address, vToken.address),
      );

      const { supplyDistributions, borrowDistributions } = formatDistributions({
        blocksPerDay,
        underlyingToken,
        underlyingTokenPriceDollars: tokenPriceDollars,
        tokens,
        tokenPriceDollarsMapping,
        supplyBalanceTokens,
        borrowBalanceTokens,
        currentBlockNumber,
        rewardsDistributorSettings:
          rewardsDistributorSettingsMapping[vToken.address.toLowerCase()] || [],
        primeApy: primeApyMap.get(vToken.address),
      });

      const disabledTokenActions = getDisabledTokenActions({
        bitmask: market.pausedActionsBitmap,
        tokenAddresses: [vToken.address, vToken.underlyingToken.address],
        chainId,
      });

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
        supplierCount,
        borrowerCount,
        borrowApyPercentage,
        supplyApyPercentage,
        supplyBalanceTokens,
        supplyBalanceCents,
        borrowBalanceTokens,
        borrowBalanceCents,
        borrowCapTokens,
        supplyCapTokens,
        supplyDistributions,
        borrowDistributions,
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

    const pool: Pool = addUserPropsToPool({
      name: p.name,
      description: p.description,
      comptrollerAddress: p.address,
      isIsolated: true,
      assets,
    });

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

  return formattedPools;
};

export default formatToPools;
