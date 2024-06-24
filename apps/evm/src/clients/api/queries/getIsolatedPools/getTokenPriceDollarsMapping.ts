import type BigNumber from 'bignumber.js';

import convertPriceMantissaToDollars from 'utilities/convertPriceMantissaToDollars';
import findTokenByAddress from 'utilities/findTokenByAddress';

import type { Market, Token } from 'types';
import type { GetApiPoolsOutput } from '../getApiPools';
import type {
  GetRewardsDistributorSettingsMappingOutput,
  RewardsDistributorSettingsResult,
} from './getRewardsDistributorSettingsMapping';

export interface GetTokenPriceDollarsMappingInput {
  tokens: Token[];
  pools: GetApiPoolsOutput['pools'];
  rewardsDistributorSettingsMapping: GetRewardsDistributorSettingsMappingOutput;
}

export interface GetTokenPriceDollarsMappingOutput {
  [tokenAddress: string]: BigNumber;
}

const getTokenPriceDollarsMapping = async ({
  tokens,
  pools,
  rewardsDistributorSettingsMapping,
}: GetTokenPriceDollarsMappingInput) => {
  // Get all underlying tokens and their prices
  const allMarkets = pools.reduce<Market[]>((acc, pool) => acc.concat(pool.markets), []);

  const underlyingTokenPrices = allMarkets.reduce<GetTokenPriceDollarsMappingOutput>(
    (acc, market) => {
      return {
        ...acc,
        [market.underlyingAddress.toLowerCase()]: market.underlyingTokenPriceMantissa,
      };
    },
    {},
  );

  // Get price data for all reward tokens
  const allRewardsDistributorSettings = Object.values(rewardsDistributorSettingsMapping).reduce<
    RewardsDistributorSettingsResult[]
  >((acc, rewardsDistributorSettings) => acc.concat(rewardsDistributorSettings), []);
  const rewardTokensPriceData =
    allRewardsDistributorSettings.reduce<GetTokenPriceDollarsMappingOutput>(
      (acc, rewardsDistributorSetting) => {
        return {
          ...acc,
          [rewardsDistributorSetting.rewardTokenAddress.toLowerCase()]:
            rewardsDistributorSetting.rewardTokenPriceMantissa,
        };
      },
      {},
    );

  const allTokensPriceData = Object.keys(rewardTokensPriceData).reduce(
    (acc, rewardTokenAddress) => ({
      ...acc,
      [rewardTokenAddress]: rewardTokensPriceData[rewardTokenAddress],
    }),
    underlyingTokenPrices,
  );

  return Object.keys(allTokensPriceData).reduce((acc, tokenAddress) => {
    const token = findTokenByAddress({
      tokens,
      address: tokenAddress,
    });

    if (!token) {
      return acc;
    }

    const tokenPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: allTokensPriceData[tokenAddress],
      decimals: token.decimals,
    });

    return {
      ...acc,
      [token.address.toLowerCase()]: tokenPriceDollars,
    };
  }, {});
};

export default getTokenPriceDollarsMapping;
