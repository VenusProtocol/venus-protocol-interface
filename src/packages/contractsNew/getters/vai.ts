/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/Vai.json';
import { Vai } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getVaiContract = genericContractGetterGenerator<Vai>({
  abi,
});

export const useGetVaiContract = genericContractGetterHookGenerator({
  getter: getVaiContract,
});
