import BigNumber from 'bignumber.js';

import type { ApiLiquidityHubResource, LiquidityHubSource, Token } from 'types';
import { areAddressesEqual } from 'utilities/areAddressesEqual';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import convertPercentageFromSmartContract from 'utilities/convertPercentageFromSmartContract';
import convertUsdMantissaToCents from 'utilities/convertUsdMantissaToCents';
import { formatApiRewardDistributors } from 'utilities/formatApiRewardDistributors';
import { PLACEHOLDER_AGENCY_ICON_SRC, agencyIconSrcByNameKey, getAgencyNameKey } from './constants';

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
  const collaterals = apiResource.exposure.reduce<LiquidityHubSource['collaterals']>(
    (acc, exposure) => {
      const token = tokens.find(t => areAddressesEqual(t.address, exposure.tokenAddress));

      if (!token || !exposure.liquidationThresholdMantissa) {
        return acc;
      }

      return [
        ...acc,
        {
          token,
          liquidationThresholdPercentage: new BigNumber(
            convertPercentageFromSmartContract(exposure.liquidationThresholdMantissa),
          ),
        },
      ];
    },
    [],
  );

  // Rating strings and agency names are rendered verbatim: agency-specific notation (Moody's `-bf`
  // suffix, S&P's `f` / `S1+` volatility pairing) carries meaning and must not be reformatted.
  const ratings = (apiResource.ratings ?? []).reduce<LiquidityHubSource['ratings']>(
    (acc, apiRating) => {
      if (!apiRating.agency) {
        return acc;
      }

      return [
        ...acc,
        {
          agencyName: apiRating.agency,
          agencyIconSrc:
            agencyIconSrcByNameKey[getAgencyNameKey(apiRating.agency)] ??
            PLACEHOLDER_AGENCY_ICON_SRC,
          value: apiRating.value ?? undefined,
          reportUrl: apiRating.reportUrl ?? undefined,
        },
      ];
    },
    [],
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
    collaterals,
    ratings,
    lockEndDate: resourceLockEndDate,
  };
};
