import BigNumber from 'bignumber.js';

import type { ApiLiquidityHubResource, LiquidityHubSource, Token } from 'types';
import { areAddressesEqual } from 'utilities/areAddressesEqual';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import convertUsdMantissaToCents from 'utilities/convertUsdMantissaToCents';
import { formatApiRewardDistributors } from 'utilities/formatApiRewardDistributors';

export const formatToLiquidityHubResource = ({
  apiResource,
  tokens,
  underlyingToken,
  tokenPriceCents,
}: {
  apiResource: ApiLiquidityHubResource;
  tokens: Token[];
  underlyingToken: Token;
  tokenPriceCents: BigNumber;
}): LiquidityHubSource => {
  const collateralTokens = tokens.filter(token =>
    apiResource.exposure.some(tokenAddress => areAddressesEqual(token.address, tokenAddress)),
  );

  const resourceLockEndDate = apiResource.lockEndTime
    ? new Date(+apiResource.lockEndTime * 1000)
    : undefined;

  const allocationTokens = convertMantissaToTokens({
    value: new BigNumber(apiResource.allocationMantissa),
    token: underlyingToken,
  });

  const allocationCentsFromApi = convertUsdMantissaToCents(apiResource.allocationUsdMantissa ?? 0);
  const allocationCents = apiResource.allocationUsdMantissa
    ? allocationCentsFromApi
    : allocationTokens.multipliedBy(tokenPriceCents);

  const { supplyTokenDistributions } = formatApiRewardDistributors({
    apiRewardDistributors: apiResource.rewardsDistributors,
    tokens,
    supplyBalanceDollars: allocationCents.dividedBy(100),
    borrowBalanceDollars: new BigNumber(0),
  });

  const supplyCapTokens = apiResource.capMantissa
    ? convertMantissaToTokens({
        value: new BigNumber(apiResource.capMantissa),
        token: underlyingToken,
      })
    : new BigNumber(Number.POSITIVE_INFINITY);

  const supplyCapCentsFromApi = convertUsdMantissaToCents(apiResource.capUsdMantissa ?? 0);
  let supplyCapCents = supplyCapTokens.multipliedBy(tokenPriceCents);

  if (apiResource.capUsdMantissa) {
    supplyCapCents = supplyCapCentsFromApi;
  }

  if (supplyCapTokens.isEqualTo(Number.POSITIVE_INFINITY)) {
    supplyCapCents = new BigNumber(Number.POSITIVE_INFINITY);
  }

  const liquidityTokens = convertMantissaToTokens({
    value: new BigNumber(apiResource.liquidityMantissa),
    token: underlyingToken,
  });

  const liquidityCents = liquidityTokens.multipliedBy(tokenPriceCents);

  return {
    name: apiResource.name ?? '',
    address: apiResource.resourceAddress,
    allocationTokens,
    allocationCents,
    supplyCapCents,
    liquidityTokens,
    liquidityCents,
    supplyApyPercentage: new BigNumber(apiResource.apyRatio).multipliedBy(100),
    supplyTokenDistributions,
    collateralTokens,
    lockEndDate: resourceLockEndDate,
  };
};
