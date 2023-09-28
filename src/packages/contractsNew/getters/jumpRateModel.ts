/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/JumpRateModel.json';
import { JumpRateModel } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getJumpRateModelContract = genericContractGetterGenerator<JumpRateModel>({
  abi,
});

export const useGetJumpRateModelContract = genericContractGetterHookGenerator({
  getter: getJumpRateModelContract,
});
