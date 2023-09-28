/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/Xvs.json';
import { Xvs } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getXvsContract = genericContractGetterGenerator<Xvs>({
  abi,
});

export const useGetXvsContract = genericContractGetterHookGenerator({
  getter: getXvsContract,
});
