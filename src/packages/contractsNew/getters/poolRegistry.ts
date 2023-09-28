/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/PoolRegistry.json';
import { PoolRegistry } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getPoolRegistryContract = uniqueContractGetterGenerator<PoolRegistry>({
  name: 'PoolRegistry',
  abi,
});

export const useGetPoolRegistryContract = uniqueContractGetterHookGenerator({
  getter: getPoolRegistryContract,
});
