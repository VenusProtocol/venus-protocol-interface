import BigNumber from 'bignumber.js';
import { Asset, AssetDistribution, Pool } from 'types';
import {
  calculateCollateralValue,
  convertDollarsToCents,
  convertTokensToWei,
  convertWeiToTokens,
  getTokenByAddress,
  getVTokenByAddress,
} from 'utilities';

import { COMPOUND_DECIMALS, COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import MAX_UINT256 from 'constants/maxUint256';
import calculateApy from 'utilities/calculateApy';

import convertFactorFromSmartContract from './convertFactorFromSmartContract';
import { FormatToPoolInput, FormatToPoolOutput } from './types';

const formatToPool = ({
  subgraphPool,
  tokenPricesDollars,
  userWalletBalances,
}: FormatToPoolInput): FormatToPoolOutput => {
  const assets = subgraphPool.markets.reduce((accAssets, subgraphMarket) => {
    const vTokenAddress = subgraphMarket.id.toLowerCase();
    const vToken = getVTokenByAddress(vTokenAddress);
    const tokenPriceDollars =
      vToken && tokenPricesDollars[vToken.underlyingToken.address.toLowerCase()];

    // Filter out assets for which we don't have a local reference of their
    // corresponding vToken
    if (!vToken || !tokenPriceDollars) {
      return accAssets;
    }

    const { apyPercentage: borrowApyPercentage } = calculateApy(subgraphMarket.borrowRate);
    const { apyPercentage: supplyApyPercentage } = calculateApy(subgraphMarket.supplyRate);

    const userWalletBalanceTokens = convertWeiToTokens({
      valueWei:
        (userWalletBalances && userWalletBalances[vToken.underlyingToken.address.toLowerCase()]) ||
        new BigNumber(0),
      token: vToken.underlyingToken,
    });
    const userWalletBalanceCents = convertDollarsToCents(
      userWalletBalanceTokens.multipliedBy(tokenPriceDollars),
    );

    const userSupplyBalanceTokens = new BigNumber(
      subgraphMarket.accounts[0]?.userSupplyBalanceWei || 0,
    );
    const userSupplyBalanceCents = convertDollarsToCents(
      userSupplyBalanceTokens.multipliedBy(tokenPriceDollars),
    );

    const userBorrowBalanceTokens = new BigNumber(
      subgraphMarket.accounts[0]?.userBorrowBalanceWei || 0,
    );
    const userBorrowBalanceCents = convertDollarsToCents(
      userBorrowBalanceTokens.multipliedBy(tokenPriceDollars),
    );

    const cashTokens = convertWeiToTokens({
      valueWei: new BigNumber(subgraphMarket.cash),
      token: vToken.underlyingToken,
    });

    const reserveTokens = convertWeiToTokens({
      valueWei: new BigNumber(subgraphMarket.reservesWei),
      token: vToken.underlyingToken,
    });

    const exchangeRateVTokens = new BigNumber(1).div(
      new BigNumber(subgraphMarket.exchangeRate).div(
        new BigNumber(10).pow(
          COMPOUND_DECIMALS + vToken.underlyingToken.decimals - vToken.decimals,
        ),
      ),
    );

    const supplyRatePerBlockTokens = new BigNumber(subgraphMarket.supplyRate).dividedBy(
      COMPOUND_MANTISSA,
    );

    const borrowRatePerBlockTokens = new BigNumber(subgraphMarket.borrowRate).dividedBy(
      COMPOUND_MANTISSA,
    );

    const supplyBalanceVWei = new BigNumber(subgraphMarket.treasuryTotalSupplyWei);
    const supplyBalanceVTokens = convertWeiToTokens({
      valueWei: supplyBalanceVWei,
      token: vToken,
    });
    const supplyBalanceTokens = supplyBalanceVTokens.div(exchangeRateVTokens);
    const supplyBalanceCents = convertDollarsToCents(
      supplyBalanceTokens.multipliedBy(tokenPriceDollars),
    );

    const borrowBalanceWei = new BigNumber(subgraphMarket.treasuryTotalBorrowsWei);
    const borrowBalanceTokens = convertWeiToTokens({
      valueWei: borrowBalanceWei,
      token: vToken.underlyingToken,
    });
    const borrowBalanceCents = convertDollarsToCents(
      borrowBalanceTokens.multipliedBy(tokenPriceDollars),
    );

    let borrowCapTokens: BigNumber | undefined = new BigNumber(subgraphMarket.borrowCapWei);
    if (borrowCapTokens.isEqualTo(0)) {
      borrowCapTokens = undefined;
    }

    let supplyCapTokens: BigNumber | undefined = new BigNumber(subgraphMarket.supplyCapWei);
    if (supplyCapTokens.isEqualTo(MAX_UINT256)) {
      supplyCapTokens = undefined;
    }

    const distributions = subgraphPool.rewardsDistributors.reduce<AssetDistribution[]>(
      (accDistributions, rewardsDistributor) => {
        const rewardTokenAddress = rewardsDistributor.reward;
        const rewardToken = getTokenByAddress(rewardTokenAddress);

        if (!rewardToken) {
          return accDistributions;
        }

        const rewardSpeeds = rewardsDistributor.rewardSpeeds.find(
          rewardSpeed => rewardSpeed.market.id.toLowerCase() === vToken.address.toLowerCase(),
        );

        if (!rewardSpeeds) {
          return accDistributions;
        }

        const {
          dailyDistributedTokens: distributionSupplyDailyRateTokens,
          apyPercentage: distributionSupplyApyPercentage,
        } = calculateApy(rewardSpeeds.supplySpeedPerBlockWei);
        const {
          dailyDistributedTokens: distributionBorrowRateTokensPerDay,
          apyPercentage: distributionBorrowApyPercentage,
        } = calculateApy(rewardSpeeds.borrowSpeedPerBlockWei);

        const distribution: AssetDistribution = {
          token: rewardToken,
          dailyDistributedTokens: distributionSupplyDailyRateTokens.plus(
            distributionBorrowRateTokensPerDay,
          ),
          borrowApyPercentage: distributionBorrowApyPercentage,
          supplyApyPercentage: distributionSupplyApyPercentage,
        };

        return [...accDistributions, distribution];
      },
      [],
    );

    const asset: Asset = {
      vToken,
      tokenPriceDollars,
      reserveFactor: convertFactorFromSmartContract({
        factor: subgraphMarket.reserveFactor,
      }),
      collateralFactor: convertFactorFromSmartContract({
        factor: subgraphMarket.collateralFactorMantissa,
      }),
      borrowCapTokens,
      supplyCapTokens,
      liquidityCents: convertDollarsToCents(cashTokens.multipliedBy(tokenPriceDollars)),
      reserveTokens,
      cashTokens,
      exchangeRateVTokens,
      supplierCount: subgraphMarket.supplierCount,
      borrowerCount: subgraphMarket.borrowerCount,
      supplyRatePerBlockTokens,
      borrowRatePerBlockTokens,
      supplyBalanceTokens,
      supplyBalanceCents,
      borrowBalanceTokens,
      borrowBalanceCents,
      borrowApyPercentage,
      supplyApyPercentage,
      distributions,
      userSupplyBalanceTokens,
      userSupplyBalanceCents,
      userBorrowBalanceTokens,
      userBorrowBalanceCents,
      userWalletBalanceTokens,
      userWalletBalanceCents,
      userPercentOfLimit: 0,
      isCollateralOfUser: subgraphMarket.accounts[0]?.isCollateralOfUser || false,
    };

    return [...accAssets, asset];
  }, [] as Asset[]);

  // Calculate user-specific props
  const { userSupplyBalanceCents, userBorrowBalanceCents, userBorrowLimitCents } = assets.reduce(
    (accAssets, asset) => {
      const assetUserCollateralValue = asset.isCollateralOfUser
        ? convertDollarsToCents(
            calculateCollateralValue({
              amountWei: convertTokensToWei({
                value: asset.userSupplyBalanceTokens,
                token: asset.vToken.underlyingToken,
              }),
              token: asset.vToken.underlyingToken,
              tokenPriceDollars: asset.tokenPriceDollars,
              collateralFactor: asset.collateralFactor,
            }),
          )
        : 0;

      return {
        userSupplyBalanceCents: accAssets.userSupplyBalanceCents + asset.supplyBalanceCents,
        userBorrowBalanceCents: accAssets.userBorrowBalanceCents + asset.borrowBalanceCents,
        userBorrowLimitCents: accAssets.userBorrowLimitCents + assetUserCollateralValue,
      };
    },
    {
      userSupplyBalanceCents: 0,
      userBorrowBalanceCents: 0,
      userBorrowLimitCents: 0,
    },
  );

  // Calculate userPercentOfLimit for each asset
  const formattedAssets: Asset[] = assets.map(asset => ({
    ...asset,
    userPercentOfLimit: new BigNumber(asset.userBorrowBalanceCents)
      .times(100)
      .div(userBorrowLimitCents)
      .dp(2)
      .toNumber(),
  }));

  const pool: Pool = {
    comptrollerAddress: subgraphPool.id,
    name: subgraphPool.name,
    description: subgraphPool.description,
    isIsolated: true,
    riskRating: subgraphPool.riskRating,
    assets: formattedAssets,
    userSupplyBalanceCents,
    userBorrowBalanceCents,
    userBorrowLimitCents,
  };

  return pool;
};

export default formatToPool;
