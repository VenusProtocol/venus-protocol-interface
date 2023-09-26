import { ContractTypeByName, getGenericContract } from 'packages/contracts';
import { extractSettledPromiseValue } from 'utilities';

import { Provider } from 'clients/web3';

export interface RewardsDistributorSettingsPromise {
  vTokenAddress: string;
  rewardsDistributorAddress: string;
  promises: [
    ReturnType<ContractTypeByName<'rewardsDistributor'>['rewardToken']>,
    ReturnType<ContractTypeByName<'rewardsDistributor'>['rewardTokenSupplySpeeds']>,
    ReturnType<ContractTypeByName<'rewardsDistributor'>['rewardTokenBorrowSpeeds']>,
    ReturnType<ContractTypeByName<'rewardsDistributor'>['rewardTokenSupplyState']>,
    ReturnType<ContractTypeByName<'rewardsDistributor'>['rewardTokenBorrowState']>,
  ];
}

export interface RewardsDistributorSettingsResult {
  rewardsDistributorAddress: string;
  rewardTokenAddress: string;
  rewardTokenSupplySpeeds: Awaited<
    ReturnType<ContractTypeByName<'rewardsDistributor'>['rewardTokenSupplySpeeds']>
  >;
  rewardTokenBorrowSpeeds: Awaited<
    ReturnType<ContractTypeByName<'rewardsDistributor'>['rewardTokenBorrowSpeeds']>
  >;
  rewardTokenSupplyState: Awaited<
    ReturnType<ContractTypeByName<'rewardsDistributor'>['rewardTokenSupplyState']>
  >;
  rewardTokenBorrowState: Awaited<
    ReturnType<ContractTypeByName<'rewardsDistributor'>['rewardTokenBorrowState']>
  >;
}

export interface GetRewardsDistributorSettingsMappingInput {
  provider: Provider;
  getRewardDistributorsResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'isolatedPoolComptroller'>['getRewardDistributors']>>
  >[];
  poolResults: Awaited<ReturnType<ContractTypeByName<'poolLens'>['getAllPools']>>;
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
        const rewardDistributorContract = getGenericContract({
          name: 'rewardsDistributor',
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
