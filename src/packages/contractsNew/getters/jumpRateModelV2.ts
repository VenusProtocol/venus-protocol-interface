/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/JumpRateModelV2.json';
import { JumpRateModelV2 } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getJumpRateModelV2Contract = genericContractGetterGenerator<JumpRateModelV2>({
  abi,
});

export const useGetJumpRateModelV2Contract = genericContractGetterHookGenerator({
  getter: getJumpRateModelV2Contract,
});
