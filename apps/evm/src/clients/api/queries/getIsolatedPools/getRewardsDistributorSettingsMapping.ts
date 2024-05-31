import {
  type IsolatedPoolComptroller,
  type PoolLens,
  type RewardsDistributor,
  getRewardsDistributorContract,
} from 'libs/contracts';
import type { Provider } from 'libs/wallet';
import extractSettledPromiseValue from 'utilities/extractSettledPromiseValue';

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
  rewardTokenSupplySpeeds: Awaited<ReturnType<RewardsDistributor['rewardTokenSupplySpeeds']>>;
  rewardTokenBorrowSpeeds: Awaited<ReturnType<RewardsDistributor['rewardTokenBorrowSpeeds']>>;
  rewardTokenSupplyState?: Awaited<ReturnType<RewardsDistributor['rewardTokenSupplyState']>>;
  rewardTokenBorrowState?: Awaited<ReturnType<RewardsDistributor['rewardTokenBorrowState']>>;
  rewardTokenSupplyStateTimeBased?: Awaited<
    ReturnType<RewardsDistributor['rewardTokenSupplyStateTimeBased']>
  >;
  rewardTokenBorrowStateTimeBased?: Awaited<
    ReturnType<RewardsDistributor['rewardTokenBorrowStateTimeBased']>
  >;
};

export interface GetRewardsDistributorSettingsMappingInput {
  isChainTimeBased: boolean;
  provider: Provider;
  getRewardDistributorsResults: PromiseSettledResult<
    Awaited<ReturnType<IsolatedPoolComptroller['getRewardDistributors']>>
  >[];
  poolResults: Awaited<ReturnType<PoolLens['getAllPools']>>;
}

export interface GetRewardsDistributorSettingsMappingOutput {
  [vTokenAddress: string]: RewardsDistributorSettingsResult[];
}

const getRewardsDistributorSettingsMapping = async ({
  isChainTimeBased,
  getRewardDistributorsResults,
  poolResults,
  provider,
}: GetRewardsDistributorSettingsMappingInput) => {
  const rewardsDistributorSettingsPromises: RewardsDistributorSettingsPromise[] = [];

  poolResults.forEach((poolResult, index) => {
    const poolRewardsDistributorAddresses = extractSettledPromiseValue(
      getRewardDistributorsResults[index],
    );

    if (!poolRewardsDistributorAddresses) {
      return;
    }

    const poolVTokenAddresses = poolResult.vTokens.map(({ vToken }) => vToken);

    poolRewardsDistributorAddresses.forEach(rewardsDistributorAddress =>
      poolVTokenAddresses.forEach(vTokenAddress => {
        const rewardDistributorContract = getRewardsDistributorContract({
          address: rewardsDistributorAddress,
          signerOrProvider: provider,
        });

        // We can't call both rewardTokenSupplyState/rewardTokenSupplyStateTimeBased and
        // rewardTokenBorrowState/rewardTokenBorrowStateTimeBased as the call to the time based
        // functions might fail in block based networks (the implementation won't change for now)
        if (isChainTimeBased) {
          rewardsDistributorSettingsPromises.push({
            vTokenAddress,
            rewardsDistributorAddress,
            promises: [
              rewardDistributorContract.rewardToken(),
              rewardDistributorContract.rewardTokenSupplySpeeds(vTokenAddress),
              rewardDistributorContract.rewardTokenBorrowSpeeds(vTokenAddress),
              rewardDistributorContract.rewardTokenSupplyStateTimeBased(vTokenAddress),
              rewardDistributorContract.rewardTokenBorrowStateTimeBased(vTokenAddress),
            ],
          });
        } else {
          rewardsDistributorSettingsPromises.push({
            vTokenAddress,
            rewardsDistributorAddress,
            promises: [
              rewardDistributorContract.rewardToken(),
              rewardDistributorContract.rewardTokenSupplySpeeds(vTokenAddress),
              rewardDistributorContract.rewardTokenBorrowSpeeds(vTokenAddress),
              rewardDistributorContract.rewardTokenSupplyState(vTokenAddress),
              rewardDistributorContract.rewardTokenBorrowState(vTokenAddress),
            ],
          });
        }
      }),
    );
  });

  const rewardsDistributorSettingsResults = await Promise.allSettled(
    rewardsDistributorSettingsPromises.map(rewardsDistributorSettingsPromise =>
      Promise.all(rewardsDistributorSettingsPromise.promises),
    ),
  );

  return rewardsDistributorSettingsResults.reduce<GetRewardsDistributorSettingsMappingOutput>(
    (acc, rewardsDistributorSettingsResult, index) => {
      const result = extractSettledPromiseValue(rewardsDistributorSettingsResult);
      const rewardsDistributorSettingsPromise = rewardsDistributorSettingsPromises[index];

      if (!result) {
        return acc;
      }

      const { vTokenAddress: unformattedVTokenAddress, rewardsDistributorAddress } =
        rewardsDistributorSettingsPromise;
      const vTokenAddress = unformattedVTokenAddress.toLowerCase();

      if (!acc[vTokenAddress]) {
        acc[vTokenAddress] = [];
      }

      const settings: RewardsDistributorSettingsResult = isChainTimeBased
        ? {
            rewardsDistributorAddress,
            rewardTokenAddress: result[0],
            rewardTokenSupplySpeeds: result[1],
            rewardTokenBorrowSpeeds: result[2],
            rewardTokenSupplyStateTimeBased: result[3] as Awaited<
              ReturnType<RewardsDistributor['rewardTokenSupplyStateTimeBased']>
            >,
            rewardTokenBorrowStateTimeBased: result[4] as Awaited<
              ReturnType<RewardsDistributor['rewardTokenBorrowStateTimeBased']>
            >,
          }
        : {
            rewardsDistributorAddress,
            rewardTokenAddress: result[0],
            rewardTokenSupplySpeeds: result[1],
            rewardTokenBorrowSpeeds: result[2],
            rewardTokenSupplyState: result[3] as Awaited<
              ReturnType<RewardsDistributor['rewardTokenSupplyState']>
            >,
            rewardTokenBorrowState: result[4] as Awaited<
              ReturnType<RewardsDistributor['rewardTokenBorrowState']>
            >,
          };

      return {
        ...acc,
        [vTokenAddress]: (acc[vTokenAddress] || []).concat([settings]),
      };
    },
    {},
  );
};

export default getRewardsDistributorSettingsMapping;
