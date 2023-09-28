/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/XvsVesting.json';
import { XvsVesting } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getXvsVestingContract = uniqueContractGetterGenerator<XvsVesting>({
  name: 'XvsVesting',
  abi,
});

export const useGetXvsVestingContract = uniqueContractGetterHookGenerator({
  getter: getXvsVestingContract,
});
