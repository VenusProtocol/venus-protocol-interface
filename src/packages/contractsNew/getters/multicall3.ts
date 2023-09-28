/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/Multicall3.json';
import { Multicall3 } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getMulticall3Contract = uniqueContractGetterGenerator<Multicall3>({
  name: 'Multicall3',
  abi,
});

export const useGetMulticall3Contract = uniqueContractGetterHookGenerator({
  getter: getMulticall3Contract,
});
