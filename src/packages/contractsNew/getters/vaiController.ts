/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/VaiController.json';
import { VaiController } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getVaiControllerContract = uniqueContractGetterGenerator<VaiController>({
  name: 'VaiController',
  abi,
});

export const useGetVaiControllerContract = uniqueContractGetterHookGenerator({
  getter: getVaiControllerContract,
});
