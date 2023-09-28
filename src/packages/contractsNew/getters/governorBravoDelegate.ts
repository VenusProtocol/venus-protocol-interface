/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/GovernorBravoDelegate.json';
import { GovernorBravoDelegate } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getGovernorBravoDelegateContract =
  uniqueContractGetterGenerator<GovernorBravoDelegate>({
    name: 'GovernorBravoDelegate',
    abi,
  });

export const useGetGovernorBravoDelegateContract = uniqueContractGetterHookGenerator({
  getter: getGovernorBravoDelegateContract,
});
