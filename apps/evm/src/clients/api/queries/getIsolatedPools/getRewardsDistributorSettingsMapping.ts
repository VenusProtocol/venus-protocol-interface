import {
  IsolatedPoolComptroller,
  PoolLens,
  RewardsDistributor,
  getRewardsDistributorContract,
} from 'libs/contracts';
import { Provider } from 'libs/wallet';

import extractSettledPromiseValue from 'utilities/extractSettledPromiseValue';

export interface RewardsDistributorSettingsPromise {
  vTokenAddress: string;
  rewardsDistributorAddress: string;
  promises: [
    ReturnType<RewardsDistributor['rewardToken']>,
    ReturnType<RewardsDistributor['rewardTokenSupplySpeeds']>,
    ReturnType<RewardsDistributor['rewardTokenBorrowSpeeds']>,
    ReturnType<RewardsDistributor['rewardTokenSupplyState']>,
    ReturnType<RewardsDistributor['rewardTokenBorrowState']>,
  ];
}

export interface RewardsDistributorSettingsResult {
  rewardsDistributorAddress: string;
  rewardTokenAddress: string;
  rewardTokenSupplySpeeds: Awaited<ReturnType<RewardsDistributor['rewardTokenSupplySpeeds']>>;
  rewardTokenBorrowSpeeds: Awaited<ReturnType<RewardsDistributor['rewardTokenBorrowSpeeds']>>;
  rewardTokenSupplyState: Awaited<ReturnType<RewardsDistributor['rewardTokenSupplyState']>>;
  rewardTokenBorrowState: Awaited<ReturnType<RewardsDistributor['rewardTokenBorrowState']>>;
}

export interface GetRewardsDistributorSettingsMappingInput {
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

      const settings: RewardsDistributorSettingsResult = {
        rewardsDistributorAddress,
        rewardTokenAddress: result[0],
        rewardTokenSupplySpeeds: result[1],
        rewardTokenBorrowSpeeds: result[2],
        rewardTokenSupplyState: result[3],
        rewardTokenBorrowState: result[4],
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
