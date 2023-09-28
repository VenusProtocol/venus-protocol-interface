/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/SwapRouter.json';
import { SwapRouter } from 'packages/contractsNew/infos/contractTypes';

import swapRouterContractGetterGenerator from 'packages/contractsNew/utilities/swapRouterContractGetterGenerator';
import swapRouterContractHookGenerator from 'packages/contractsNew/utilities/swapRouterContractGetterHookGenerator';

export const getSwapRouterContract = swapRouterContractGetterGenerator<SwapRouter>({
  abi,
});

export const useGetSwapRouterContract = swapRouterContractHookGenerator({
  getter: getSwapRouterContract,
});
