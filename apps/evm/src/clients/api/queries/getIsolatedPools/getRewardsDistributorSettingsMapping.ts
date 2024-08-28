import type BigNumber from 'bignumber.js';
import type { RewardsDistributor } from 'libs/contracts';
import type { Market } from 'types';
import type { GetApiPoolsOutput } from '../getApiPools';

type RewardTokenBorrowStatePromise =
  | ReturnType<RewardsDistributor['rewardTokenBorrowStateTimeBased']>
  | ReturnType<RewardsDistributor['rewardTokenBorrowState']>;

type RewardTokenSupplyStatePromise =
  | ReturnType<RewardsDistributor['rewardTokenSupplyStateTimeBased']>
  | ReturnType<RewardsDistributor['rewardTokenSupplyState']>;

export interface RewardsDistributorSettingsPromise {
  vTokenAddress: string;
  rewardsDistributorAddress: string;
  promises: [
    ReturnType<RewardsDistributor['rewardToken']>,
    ReturnType<RewardsDistributor['rewardTokenSupplySpeeds']>,
    ReturnType<RewardsDistributor['rewardTokenBorrowSpeeds']>,
    RewardTokenSupplyStatePromise,
    RewardTokenBorrowStatePromise,
  ];
}

export type RewardsDistributorSettingsResult = {
  rewardsDistributorAddress: string;
  rewardTokenAddress: string;
  rewardTokenSupplySpeeds: BigNumber;
  rewardTokenBorrowSpeeds: BigNumber;
  rewardTokenLastRewardingSupplyBlockOrTimestamp: BigNumber;
  rewardTokenLastRewardingBorrowBlockOrTimestamp: BigNumber;
  rewardTokenPriceMantissa: BigNumber;
};

export interface GetRewardsDistributorSettingsMappingInput {
  pools: GetApiPoolsOutput['pools'];
}

export interface GetRewardsDistributorSettingsMappingOutput {
  [vTokenAddress: string]: RewardsDistributorSettingsResult[];
}

const getRewardsDistributorSettingsMapping = async ({
  pools,
}: GetRewardsDistributorSettingsMappingInput) => {
  const allIsolatedMarkets = pools.reduce<Market[]>((acc, pool) => acc.concat(...pool.markets), []);

  return allIsolatedMarkets.reduce<GetRewardsDistributorSettingsMappingOutput>((acc, market) => {
    const vTokenAddress = market.address.toLowerCase();

    if (!acc[vTokenAddress]) {
      acc[vTokenAddress] = [];
    }

    market.rewardsDistributors.forEach(rd => {
      const settings: RewardsDistributorSettingsResult = {
        rewardsDistributorAddress: rd.rewardsDistributorContractAddress,
        rewardTokenAddress: rd.rewardTokenAddress,
        rewardTokenSupplySpeeds: rd.supplySpeed,
        rewardTokenBorrowSpeeds: rd.borrowSpeed,
        rewardTokenLastRewardingSupplyBlockOrTimestamp: rd.lastRewardingSupplyBlockOrTimestamp,
        rewardTokenLastRewardingBorrowBlockOrTimestamp: rd.lastRewardingBorrowBlockOrTimestamp,
        rewardTokenPriceMantissa: rd.priceMantissa,
      };
      acc[vTokenAddress] = acc[vTokenAddress].concat(settings);
    });

    return {
      ...acc,
    };
  }, {});
};

export default getRewardsDistributorSettingsMapping;
