/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/Vrt.json';
import { Vrt } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getVrtContract = genericContractGetterGenerator<Vrt>({
  abi,
});

export const useGetVrtContract = genericContractGetterHookGenerator({
  getter: getVrtContract,
});
