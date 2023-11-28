import BigNumber from 'bignumber.js';

import { ResilientOracle } from 'packages/contracts';
import { Token } from 'types';
import convertPriceMantissaToDollars from 'utilities/convertPriceMantissaToDollars';
import extractSettledPromiseValue from 'utilities/extractSettledPromiseValue';
import findTokenByAddress from 'utilities/findTokenByAddress';
import removeDuplicates from 'utilities/removeDuplicates';

import { GetRewardsDistributorSettingsMappingOutput } from './getRewardsDistributorSettingsMapping';

export interface GetTokenPriceDollarsMappingInput {
  tokens: Token[];
  rewardsDistributorSettingsMapping: GetRewardsDistributorSettingsMappingOutput;
  underlyingTokenAddresses: string[];
  resilientOracleContract: ResilientOracle;
}

export interface GetTokenPriceDollarsMappingOutput {
  [tokenAddress: string]: BigNumber;
}

const getTokenPriceDollarsMapping = async ({
  tokens,
  rewardsDistributorSettingsMapping,
  underlyingTokenAddresses,
  resilientOracleContract,
}: GetTokenPriceDollarsMappingInput) => {
  // Get all reward token addresses
  const rewardTokenAddresses = Object.values(rewardsDistributorSettingsMapping).reduce<string[]>(
    (acc, rewardsDistributorSettings) => {
      const newRewardTokenAddresses = rewardsDistributorSettings.map(({ rewardTokenAddress }) =>
        rewardTokenAddress.toLowerCase(),
      );

      return acc.concat(newRewardTokenAddresses);
    },
    [],
  );

  // Fetch token prices
  const tokenAddresses = removeDuplicates(underlyingTokenAddresses.concat(rewardTokenAddresses));

  const tokenPriceMantissaResults = await Promise.allSettled(
    tokenAddresses.map(tokenAddress => resilientOracleContract.getPrice(tokenAddress)),
  );

  return tokenPriceMantissaResults.reduce<GetTokenPriceDollarsMappingOutput>(
    (acc, result, index) => {
      const priceMantissa = extractSettledPromiseValue(result);

      if (!priceMantissa) {
        return acc;
      }

      const token = findTokenByAddress({
        tokens,
        address: tokenAddresses[index],
      });

      if (!token) {
        return acc;
      }

      const tokenPriceDollars = convertPriceMantissaToDollars({
        priceMantissa: new BigNumber(priceMantissa.toString()),
        token,
      });

      return {
        ...acc,
        [token.address.toLowerCase()]: tokenPriceDollars,
      };
    },
    {},
  );
};

export default getTokenPriceDollarsMapping;
