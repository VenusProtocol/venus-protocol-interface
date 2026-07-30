import BigNumber from 'bignumber.js';

import type { ApiLiquidityHubYieldGroup, LiquidityHubYieldGroup, Token } from 'types';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import convertUsdMantissaToCents from 'utilities/convertUsdMantissaToCents';
import { metadataByType } from './constants';
import { formatToLiquidityHubResource } from './formatToLiquidityHubResource';

export const formatToLiquidityHubYieldGroup = ({
  apiYieldGroup,
  tokens,
  underlyingToken,
  tokenPriceCents,
}: {
  apiYieldGroup: ApiLiquidityHubYieldGroup;
  tokens: Token[];
  underlyingToken: Token;
  tokenPriceCents: BigNumber;
}): LiquidityHubYieldGroup => {
  const type = apiYieldGroup.kind ?? 'core';
  const metadata = metadataByType[type];

  const sources = apiYieldGroup.resources.map(apiResource =>
    formatToLiquidityHubResource({
      apiResource,
      tokens,
      underlyingToken,
      tokenPriceCents,
    }),
  );

  const allocationTokens = convertMantissaToTokens({
    value: new BigNumber(apiYieldGroup.totalUnderlyingMantissa),
    token: underlyingToken,
  });

  const allocationCentsFromApi = convertUsdMantissaToCents(
    apiYieldGroup.totalUnderlyingUsdMantissa ?? 0,
  );

  const allocationCents = apiYieldGroup.totalUnderlyingUsdMantissa
    ? allocationCentsFromApi
    : allocationTokens.multipliedBy(tokenPriceCents);

  const supplyCapTokens = apiYieldGroup.effectiveCapMantissa
    ? convertMantissaToTokens({
        value: new BigNumber(apiYieldGroup.effectiveCapMantissa),
        token: underlyingToken,
      })
    : new BigNumber(Number.POSITIVE_INFINITY);

  const supplyCapCentsFromApi = convertUsdMantissaToCents(
    apiYieldGroup.absoluteCapUsdMantissa ?? 0,
  );
  let supplyCapCents = apiYieldGroup.absoluteCapUsdMantissa
    ? supplyCapCentsFromApi
    : supplyCapTokens.multipliedBy(tokenPriceCents);

  if (supplyCapTokens.isEqualTo(Number.POSITIVE_INFINITY)) {
    supplyCapCents = new BigNumber(Number.POSITIVE_INFINITY);
  }

  const liquidityTokens = convertMantissaToTokens({
    value: new BigNumber(apiYieldGroup.maxWithdrawMantissa),
    token: underlyingToken,
  });
  const liquidityCents = liquidityTokens.multipliedBy(tokenPriceCents);

  return {
    address: apiYieldGroup.yieldGroupAddress,
    type,
    nameTranslationKey: metadata.nameTranslationKey,
    iconSrc: metadata.iconSrc,
    bgClassName: metadata.bgClassName,
    allocationTokens,
    allocationCents,
    allocationCapPercentage: new BigNumber(apiYieldGroup.percentageCapRatio).multipliedBy(100),
    supplyCapTokens,
    supplyCapCents,
    liquidityTokens,
    liquidityCents,
    averageSupplyApyPercentage: new BigNumber(apiYieldGroup.spotApyRatio).multipliedBy(100),
    paused: apiYieldGroup.isPaused,
    sources,
  };
};
