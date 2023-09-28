/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/Bep20.json';
import { Bep20 } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getBep20Contract = genericContractGetterGenerator<Bep20>({
  abi,
});

export const useGetBep20Contract = genericContractGetterHookGenerator({
  getter: getBep20Contract,
});
