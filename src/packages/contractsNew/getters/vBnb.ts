/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/VBnb.json';
import { VBnb } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getVBnbContract = genericContractGetterGenerator<VBnb>({
  abi,
});

export const useGetVBnbContract = genericContractGetterHookGenerator({
  getter: getVBnbContract,
});
