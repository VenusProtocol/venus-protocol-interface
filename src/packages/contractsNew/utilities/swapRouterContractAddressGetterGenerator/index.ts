import { ChainId } from 'types';

import { getSwapRouterContractAddress } from 'packages/contractsNew/utilities/getSwapRouterContractAddress';

export interface SwapRouterContractAddressGetterInput {
  comptrollerContractAddress: string;
  chainId: ChainId;
}

export type SwapRouterContractAddressGetter = (
  input: SwapRouterContractAddressGetterInput,
) => string | undefined;

export const swapRouterContractAddressGetterGenerator = () => {
  const getter: SwapRouterContractAddressGetter = ({ chainId, comptrollerContractAddress }) =>
    getSwapRouterContractAddress({ comptrollerContractAddress, chainId });

  return getter;
};
