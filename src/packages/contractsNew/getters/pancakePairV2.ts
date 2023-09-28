/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/PancakePairV2.json';
import { PancakePairV2 } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getPancakePairV2Contract = genericContractGetterGenerator<PancakePairV2>({
  abi,
});

export const useGetPancakePairV2Contract = genericContractGetterHookGenerator({
  getter: getPancakePairV2Contract,
});
