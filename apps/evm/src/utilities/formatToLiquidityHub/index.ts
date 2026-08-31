import BigNumber from 'bignumber.js';

import type { ApiLiquidityHub, LiquidityHub, Token, VhToken } from 'types';
import { areAddressesEqual } from 'utilities/areAddressesEqual';
import { calculateYearlyInterests } from 'utilities/calculateYearlyEarnings';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import { convertRatioToPercentage } from 'utilities/convertRatioToPercentage';
import convertUsdMantissaToCents from 'utilities/convertUsdMantissaToCents';
import { formatApiRewardDistributors } from 'utilities/formatApiRewardDistributors';
import getCombinedApy from 'utilities/getCombinedApy';
import { formatToLiquidityHubYieldGroup } from './formatToLiquidityHubYieldGroup';

export const formatToLiquidityHub = ({
  apiLiquidityHub,
  tokens,
}: {
  apiLiquidityHub: ApiLiquidityHub;
  tokens: Token[];
}): LiquidityHub | undefined => {
  const underlyingToken = tokens.find(token =>
    areAddressesEqual(token.address, apiLiquidityHub.underlyingTokenAddress),
  );

  if (!underlyingToken) {
    return;
  }

  const vhToken: VhToken = {
    address: apiLiquidityHub.hubAddress,
    chainId: underlyingToken.chainId,
    decimals: apiLiquidityHub.hubTokenDecimals,
    symbol: apiLiquidityHub.symbol ?? `vh${underlyingToken.symbol}`,
    underlyingToken,
  };

  const supplyBalanceTokens = convertMantissaToTokens({
    value: new BigNumber(apiLiquidityHub.totalUnderlyingMantissa),
    token: underlyingToken,
  });
  const supplyBalanceCentsFromApi = convertUsdMantissaToCents(
    apiLiquidityHub.totalUnderlyingUsdMantissa ?? 0,
  );
  const tokenPriceCents = convertUsdMantissaToCents(apiLiquidityHub.tokenPriceUsdMantissa ?? 0);

  const supplyBalanceCents = apiLiquidityHub.totalUnderlyingUsdMantissa
    ? supplyBalanceCentsFromApi
    : supplyBalanceTokens.multipliedBy(tokenPriceCents);

  const liquidityTokens = convertMantissaToTokens({
    value: new BigNumber(apiLiquidityHub.liquidityMantissa),
    token: underlyingToken,
  });

  const liquidityCentsFromApi = convertUsdMantissaToCents(
    apiLiquidityHub.liquidityUsdMantissa ?? 0,
  );

  const liquidityCents = apiLiquidityHub.liquidityUsdMantissa
    ? liquidityCentsFromApi
    : liquidityTokens.multipliedBy(tokenPriceCents);

  const withdrawCapTokens = convertMantissaToTokens({
    value: new BigNumber(apiLiquidityHub.maxWithdrawalSizeMantissa),
    token: underlyingToken,
  });

  const userSupplyBalanceTokens = apiLiquidityHub.userUnderlyingBalanceMantissa
    ? convertMantissaToTokens({
        value: new BigNumber(apiLiquidityHub.userUnderlyingBalanceMantissa),
        token: underlyingToken,
      })
    : undefined;

  const userWalletBalanceTokens = apiLiquidityHub.userWalletBalanceMantissa
    ? convertMantissaToTokens({
        value: new BigNumber(apiLiquidityHub.userWalletBalanceMantissa),
        token: underlyingToken,
      })
    : undefined;

  const userVhTokenBalanceTokens = apiLiquidityHub.userHubTokenBalanceMantissa
    ? convertMantissaToTokens({
        value: new BigNumber(apiLiquidityHub.userHubTokenBalanceMantissa),
        token: vhToken,
      })
    : undefined;

  const userWalletBalanceCents = apiLiquidityHub.userWalletBalanceUsdMantissa
    ? convertUsdMantissaToCents(apiLiquidityHub.userWalletBalanceUsdMantissa)
    : userWalletBalanceTokens?.multipliedBy(tokenPriceCents);

  const userSupplyBalanceCents = apiLiquidityHub.userUnderlyingBalanceUsdMantissa
    ? convertUsdMantissaToCents(apiLiquidityHub.userUnderlyingBalanceUsdMantissa)
    : userSupplyBalanceTokens?.multipliedBy(tokenPriceCents);

  const userSupplyCapTokens = apiLiquidityHub.userMaxDepositMantissa
    ? convertMantissaToTokens({
        value: new BigNumber(apiLiquidityHub.userMaxDepositMantissa),
        token: vhToken.underlyingToken,
      })
    : undefined;

  const userWithdrawCapTokens = apiLiquidityHub.userMaxWithdrawMantissa
    ? convertMantissaToTokens({
        value: new BigNumber(apiLiquidityHub.userMaxWithdrawMantissa),
        token: vhToken.underlyingToken,
      })
    : undefined;

  const userVhTokenMaxRedeemTokens = apiLiquidityHub.userMaxRedeemMantissa
    ? convertMantissaToTokens({
        value: new BigNumber(apiLiquidityHub.userMaxRedeemMantissa),
        token: vhToken,
      })
    : undefined;

  const pricePerShare = new BigNumber(apiLiquidityHub.pricePerShare);
  const supplyApyPercentage = convertRatioToPercentage(apiLiquidityHub.blendedApyRatio);

  const yieldGroups = apiLiquidityHub.yieldGroups.map(apiYieldGroup =>
    formatToLiquidityHubYieldGroup({ apiYieldGroup, tokens, underlyingToken, tokenPriceCents }),
  );

  const { supplyTokenDistributions } = formatApiRewardDistributors({
    apiRewardDistributors: apiLiquidityHub.rewardsDistributors,
    tokens,
  });

  const { totalApyPercentage } = getCombinedApy({
    type: 'supply',
    baseApyPercentage: supplyApyPercentage,
    tokenDistributions: supplyTokenDistributions,
  });

  const userYearlyEarningsCents = userSupplyBalanceCents
    ? calculateYearlyInterests({
        balance: userSupplyBalanceCents,
        interestPercentage: totalApyPercentage,
      })
    : undefined;

  return {
    vhToken,
    tokenPriceCents,
    tokenPriceOracleAddress: apiLiquidityHub.tokenPriceOracleAddress,
    supplyBalanceTokens,
    supplyBalanceCents,
    liquidityTokens,
    liquidityCents,
    withdrawCapTokens,
    supplyCapTokens: apiLiquidityHub.supplyCapacityMantissa
      ? convertMantissaToTokens({
          value: new BigNumber(apiLiquidityHub.supplyCapacityMantissa),
          token: underlyingToken,
        })
      : new BigNumber(Number.POSITIVE_INFINITY),
    supplyApyPercentage,
    performanceFeePercentage: new BigNumber(apiLiquidityHub.performanceFeeRatio).multipliedBy(100),
    redeemFeePercentage: new BigNumber(apiLiquidityHub.redeemFeeRatio).multipliedBy(100),
    pricePerShare,
    supplierCount: apiLiquidityHub.suppliersCount ?? 0,
    yieldGroups,
    supplyTokenDistributions,
    userWalletBalanceTokens,
    userWalletBalanceCents,
    userSupplyBalanceTokens,
    userSupplyBalanceCents,
    userYearlyEarningsCents,
    userVhTokenBalanceTokens,
    userSupplyCapTokens,
    userWithdrawCapTokens,
    userVhTokenMaxRedeemTokens,
  };
};
