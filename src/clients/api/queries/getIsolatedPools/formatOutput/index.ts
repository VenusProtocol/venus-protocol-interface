import BigNumber from 'bignumber.js';
import { ContractCallReturnContext } from 'ethereum-multicall';
import { ContractTypeByName } from 'packages/contracts';
import { Asset, Pool, Token, VToken } from 'types';
import {
  addUserPropsToPool,
  areAddressesEqual,
  areTokensEqual,
  calculateApy,
  convertDollarsToCents,
  convertFactorFromSmartContract,
  convertWeiToTokens,
  formatTokenPrices,
  multiplyMantissaDaily,
} from 'utilities';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import { logError } from 'context/ErrorLogger';
import findTokenByAddress from 'utilities/findTokenByAddress';

import { GetTokenBalancesOutput } from '../../getTokenBalances';
import formatDistributions from './formatDistributions';
import formatRewardTokenDataMapping from './formatRewardTokenDataMapping';

export interface FormatToPoolsInput {
  tokens: Token[];
  poolsResults: Awaited<ReturnType<ContractTypeByName<'poolLens'>['getAllPools']>>;
  comptrollerResults: ContractCallReturnContext[];
  rewardsDistributorsResults: ContractCallReturnContext[];
  resilientOracleResult: ContractCallReturnContext;
  currentBlockNumber: number;
  poolParticipantsCountResult?: Awaited<ReturnType<typeof getIsolatedPoolParticipantsCount>>;
  poolLensResult?: ContractCallReturnContext;
  userWalletTokenBalances?: GetTokenBalancesOutput;
}

const formatToPools = ({
  tokens,
  poolsResults,
  poolParticipantsCountResult,
  comptrollerResults,
  rewardsDistributorsResults,
  resilientOracleResult,
  poolLensResult,
  userWalletTokenBalances,
  currentBlockNumber,
}: FormatToPoolsInput) => {
  // Map token prices by address
  const tokenPricesDollars = formatTokenPrices({ resilientOracleResult, tokens });

  // Map distributions by vToken address
  const rewardTokenDataMapping = formatRewardTokenDataMapping({
    rewardsDistributorsResults,
    tokenPricesDollars,
    tokens,
  });

  // Get vToken addresses of user collaterals
  const userCollateralVTokenAddresses = comptrollerResults.reduce<string[]>(
    (acc, res) =>
      acc.concat(
        res.callsReturnContext[1]
          ? res.callsReturnContext[1].returnValues.map(item => item.toLowerCase())
          : [],
      ),
    [],
  );

  const pools: Pool[] = poolsResults.map(poolResult => {
    const subgraphPool = poolParticipantsCountResult?.pools.find(pool =>
      areAddressesEqual(pool.id, poolResult.comptroller),
    );

    const assets = poolResult.vTokens.reduce<Asset[]>((acc, vTokenMetaData) => {
      // Retrieve token record
      const underlyingToken = findTokenByAddress({
        tokens,
        address: vTokenMetaData.underlyingAssetAddress,
      });

      if (!underlyingToken) {
        logError(`Record missing for underlying token: ${vTokenMetaData.underlyingAssetAddress}`);
        return acc;
      }

      // Shape vToken
      const vToken: VToken = {
        address: vTokenMetaData.vToken,
        decimals: 8,
        symbol: `v${underlyingToken.symbol}`,
        underlyingToken,
      };

      const tokenPriceDollars = tokenPricesDollars[vToken.underlyingToken.address.toLowerCase()];

      // Skip token if we couldn't fetch a dollar price for it
      if (!tokenPriceDollars) {
        logError(
          `Price could not be fetched for token: ${vToken.underlyingToken.symbol} (${vToken.underlyingToken.address})`,
        );
        return acc;
      }

      const poolLensResults = poolLensResult?.callsReturnContext;

      const vTokenUserBalances =
        poolLensResults &&
        poolLensResults[poolLensResults.length - 1].returnValues.find(userBalances =>
          areAddressesEqual(userBalances[0], vToken.address),
        );

      const tokenPriceCents = convertDollarsToCents(tokenPriceDollars);

      // Extract supplierCount and borrowerCount from subgraph result
      const subgraphPoolMarket = subgraphPool?.markets.find(market =>
        areAddressesEqual(market.id, vToken.address),
      );
      const supplierCount = +(subgraphPoolMarket?.supplierCount || 0);
      const borrowerCount = +(subgraphPoolMarket?.borrowerCount || 0);

      const borrowCapTokens = convertWeiToTokens({
        valueWei: new BigNumber(vTokenMetaData.borrowCaps.toString()),
        token: vToken.underlyingToken,
      });

      const supplyCapTokens = convertWeiToTokens({
        valueWei: new BigNumber(vTokenMetaData.supplyCaps.toString()),
        token: vToken.underlyingToken,
      });

      const reserveFactor = convertFactorFromSmartContract({
        factor: new BigNumber(vTokenMetaData.reserveFactorMantissa.toString()),
      });

      const collateralFactor = convertFactorFromSmartContract({
        factor: new BigNumber(vTokenMetaData.collateralFactorMantissa.toString()),
      });

      const cashTokens = convertWeiToTokens({
        valueWei: new BigNumber(vTokenMetaData.totalCash.toString()),
        token: vToken.underlyingToken,
      });

      const liquidityCents = cashTokens.multipliedBy(tokenPriceCents);

      const reserveTokens = convertWeiToTokens({
        valueWei: new BigNumber(vTokenMetaData.totalReserves.toString()),
        token: vToken.underlyingToken,
      });

      const exchangeRateVTokens = new BigNumber(1).div(
        new BigNumber(vTokenMetaData.exchangeRateCurrent.toString()).div(
          new BigNumber(10).pow(
            COMPOUND_DECIMALS + vToken.underlyingToken.decimals - vToken.decimals,
          ),
        ),
      );

      const supplyDailyPercentageRate = multiplyMantissaDaily({
        mantissa: new BigNumber(vTokenMetaData.supplyRatePerBlock.toString()),
      });

      const supplyApyPercentage = calculateApy({
        dailyRate: supplyDailyPercentageRate,
      });

      const borrowDailyPercentageRate = multiplyMantissaDaily({
        mantissa: new BigNumber(vTokenMetaData.borrowRatePerBlock.toString()),
      });

      const borrowApyPercentage = calculateApy({
        dailyRate: borrowDailyPercentageRate,
      });

      const supplyPercentageRatePerBlock = supplyDailyPercentageRate.dividedBy(BLOCKS_PER_DAY);
      const borrowPercentageRatePerBlock = borrowDailyPercentageRate.dividedBy(BLOCKS_PER_DAY);

      const supplyBalanceVTokens = convertWeiToTokens({
        valueWei: new BigNumber(vTokenMetaData.totalSupply.toString()),
        token: vToken,
      });
      const supplyBalanceTokens = supplyBalanceVTokens.div(exchangeRateVTokens);
      const supplyBalanceCents = supplyBalanceTokens.multipliedBy(tokenPriceCents);

      const borrowBalanceTokens = convertWeiToTokens({
        valueWei: new BigNumber(vTokenMetaData.totalBorrows.toString()),
        token: vToken.underlyingToken,
      });

      const borrowBalanceCents = borrowBalanceTokens.multipliedBy(tokenPriceCents);

      // User-specific props
      const userBorrowBalanceTokens = vTokenUserBalances
        ? convertWeiToTokens({
            valueWei: new BigNumber(vTokenUserBalances[2].hex),
            token: vToken.underlyingToken,
          })
        : new BigNumber(0);

      const userSupplyBalanceTokens = vTokenUserBalances
        ? convertWeiToTokens({
            valueWei: new BigNumber(vTokenUserBalances[3].hex),
            token: vToken.underlyingToken,
          })
        : new BigNumber(0);

      const tokenBalanceRes = userWalletTokenBalances?.tokenBalances.find(tokenBalance =>
        areTokensEqual(tokenBalance.token, vToken.underlyingToken),
      );

      const userWalletBalanceTokens = tokenBalanceRes
        ? convertWeiToTokens({
            valueWei: tokenBalanceRes.balanceWei,
            token: tokenBalanceRes.token,
          })
        : new BigNumber(0);

      const userSupplyBalanceCents = userSupplyBalanceTokens.multipliedBy(tokenPriceCents);
      const userBorrowBalanceCents = userBorrowBalanceTokens.multipliedBy(tokenPriceCents);
      const userWalletBalanceCents = userWalletBalanceTokens.multipliedBy(tokenPriceCents);

      const isCollateralOfUser = userCollateralVTokenAddresses.includes(
        vToken.address.toLowerCase(),
      );

      const { supplyDistributions, borrowDistributions } = formatDistributions({
        tokenPriceDollars,
        supplyBalanceTokens,
        borrowBalanceTokens,
        currentBlockNumber,
        rewardTokenData: rewardTokenDataMapping[vToken.address.toLowerCase()] || [],
      });

      const asset: Asset = {
        vToken,
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
        supplyPercentageRatePerBlock,
        borrowPercentageRatePerBlock,
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
      name: poolResult.name,
      description: poolResult.description,
      comptrollerAddress: poolResult.comptroller,
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

  return pools;
};

export default formatToPools;
