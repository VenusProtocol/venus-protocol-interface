/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/PoolLens.json';
import { PoolLens } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getPoolLensContract = uniqueContractGetterGenerator<PoolLens>({
  name: 'PoolLens',
  abi,
});

export const useGetPoolLensContract = uniqueContractGetterHookGenerator({
  getter: getPoolLensContract,
});
