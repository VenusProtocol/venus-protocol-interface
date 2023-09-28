/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/VrtConverter.json';
import { VrtConverter } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getVrtConverterContract = uniqueContractGetterGenerator<VrtConverter>({
  name: 'VrtConverter',
  abi,
});

export const useGetVrtConverterContract = uniqueContractGetterHookGenerator({
  getter: getVrtConverterContract,
});
