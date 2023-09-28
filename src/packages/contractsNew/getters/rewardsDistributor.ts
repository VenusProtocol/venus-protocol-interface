/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/RewardsDistributor.json';
import { RewardsDistributor } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getRewardsDistributorContract = genericContractGetterGenerator<RewardsDistributor>({
  abi,
});

export const useGetRewardsDistributorContract = genericContractGetterHookGenerator({
  getter: getRewardsDistributorContract,
});
