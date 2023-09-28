/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/XvsStore.json';
import { XvsStore } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getXvsStoreContract = uniqueContractGetterGenerator<XvsStore>({
  name: 'XvsStore',
  abi,
});

export const useGetXvsStoreContract = uniqueContractGetterHookGenerator({
  getter: getXvsStoreContract,
});
