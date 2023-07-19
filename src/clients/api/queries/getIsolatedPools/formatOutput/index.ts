import BigNumber from 'bignumber.js';
import { Asset, Pool } from 'types';
import {
  addUserPropsToPool,
  areAddressesEqual,
  areTokensEqual,
  calculateApy,
  calculateDailyDistributedTokens,
  convertDollarsToCents,
  convertWeiToTokens,
  getVTokenByAddress,
} from 'utilities';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import { MAINNET_TOKENS } from 'constants/tokens';
import { logError } from 'context/ErrorLogger';

import { FormatToPoolInput } from '../types';
import convertFactorFromSmartContract from './convertFactorFromSmartContract';
import formatDailyDistributedTokensMapping from './formatDailyDistributedTokensMapping';
import formatDistributions from './formatDistributions';
import formatTokenPrices from './formatTokenPrices';

const formatToPools = ({
  poolsResults,
  poolParticipantsCountResult,
  comptrollerResults,
  rewardsDistributorsResults,
  resilientOracleResult,
  poolLensResult,
  userWalletTokenBalances,
}: FormatToPoolInput) => {
  // Map token prices by address
  const tokenPricesDollars = formatTokenPrices(resilientOracleResult);

  // Map distributions by vToken address
  const dailyDistributedTokensMapping = formatDailyDistributedTokensMapping({
    rewardsDistributorsResults,
    tokenPricesDollars,
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
    const vTokenAddresses: string[] = poolResult.vTokens.map(item => item.vToken);

    const subgraphPool = poolParticipantsCountResult.pools.find(pool =>
      areAddressesEqual(pool.id, poolResult.comptroller),
    );

    const assets = vTokenAddresses.reduce<Asset[]>((acc, vTokenAddress) => {
      const vToken = getVTokenByAddress(vTokenAddress);

      if (!vToken) {
        logError(`Record missing for vToken: ${vTokenAddress}`);
        return acc;
      }

      const poolLensResults = poolLensResult?.callsReturnContext;
      const vTokenMetaData = poolResult.vTokens.find(
        item => item.isListed && areAddressesEqual(item.vToken, vTokenAddress),
      );

      // Skip vToken if we couldn't fetch sufficient data
      if (!vTokenMetaData) {
        logError(`Metadata could not be fetched for vToken: ${vTokenAddress}`);
        return acc;
      }

      const tokenPriceDollars = tokenPricesDollars[vToken.underlyingToken.address.toLowerCase()];

      // Skip token if we couldn't fetch a dollar price for it
      if (!tokenPriceDollars) {
        logError(
          `Price could not be fetched for token: ${vToken.underlyingToken.symbol} (${vToken.underlyingToken.address})`,
        );
        return acc;
      }

      // Temporary hotfix following multichain issue
      if (areTokensEqual(vToken.underlyingToken, MAINNET_TOKENS.bifi)) {
        return acc;
      }

      const vTokenUserBalances =
        poolLensResults &&
        poolLensResults[poolLensResults.length - 1].returnValues.find(userBalances =>
          areAddressesEqual(userBalances[0], vTokenAddress),
        );

      const tokenPriceCents = new BigNumber(convertDollarsToCents(tokenPriceDollars));

      // Extract supplierCount and borrowerCount from subgraph result
      const subgraphPoolMarket = subgraphPool?.markets.find(market =>
        areAddressesEqual(market.id, vTokenAddress),
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

      const supplyDailyDistributedTokens = calculateDailyDistributedTokens({
        ratePerBlockMantissa: new BigNumber(vTokenMetaData.supplyRatePerBlock.toString()),
      });

      const supplyApyPercentage = calculateApy({
        dailyDistributedTokens: supplyDailyDistributedTokens,
      });

      const borrowDailyDistributedTokens = calculateDailyDistributedTokens({
        ratePerBlockMantissa: new BigNumber(vTokenMetaData.borrowRatePerBlock.toString()),
      });

      const borrowApyPercentage = calculateApy({
        dailyDistributedTokens: borrowDailyDistributedTokens,
      });

      const supplyRatePerBlockTokens = supplyDailyDistributedTokens.dividedBy(BLOCKS_PER_DAY);
      const borrowRatePerBlockTokens = borrowDailyDistributedTokens.dividedBy(BLOCKS_PER_DAY);

      const supplyBalanceVTokens = convertWeiToTokens({
        valueWei: new BigNumber(vTokenMetaData.totalSupply.toString()),
        token: vToken,
      });
      const supplyBalanceTokens = supplyBalanceVTokens.multipliedBy(exchangeRateVTokens);
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
        vTokenAddress.toLowerCase(),
      );

      const distributions = formatDistributions({
        dailyDistributedTokens: dailyDistributedTokensMapping[vToken.address.toLowerCase()] || [],
        supplyBalanceTokens,
        borrowBalanceTokens,
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
        supplyRatePerBlockTokens,
        borrowRatePerBlockTokens,
        supplyBalanceTokens,
        supplyBalanceCents,
        borrowBalanceTokens,
        borrowBalanceCents,
        borrowCapTokens,
        supplyCapTokens,
        distributions,
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
