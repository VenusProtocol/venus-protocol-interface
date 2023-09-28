/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/MainPoolComptroller.json';
import { MainPoolComptroller } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getMainPoolComptrollerContract = uniqueContractGetterGenerator<MainPoolComptroller>({
  name: 'MainPoolComptroller',
  abi,
});

export const useGetMainPoolComptrollerContract = uniqueContractGetterHookGenerator({
  getter: getMainPoolComptrollerContract,
});
