/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/Maximillion.json';
import { Maximillion } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getMaximillionContract = uniqueContractGetterGenerator<Maximillion>({
  name: 'Maximillion',
  abi,
});

export const useGetMaximillionContract = uniqueContractGetterHookGenerator({
  getter: getMaximillionContract,
});
