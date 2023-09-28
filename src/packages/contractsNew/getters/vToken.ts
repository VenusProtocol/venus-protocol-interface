/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/VToken.json';
import { VToken } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getVTokenContract = genericContractGetterGenerator<VToken>({
  abi,
});

export const useGetVTokenContract = genericContractGetterHookGenerator({
  getter: getVTokenContract,
});
