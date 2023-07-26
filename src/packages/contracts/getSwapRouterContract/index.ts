import type { Provider } from '@ethersproject/abstract-provider';
import { Contract, Signer } from 'ethers';

import { SwapRouterContractType, swapRouter } from '../contractInfos';
import {
  GetSwapRouterContractAddressInput,
  getSwapRouterContractAddress,
} from '../getSwapRouterContractAddress';

export interface GetSwapRouterContractInput extends GetSwapRouterContractAddressInput {
  signerOrProvider: Signer | Provider;
}

export function getSwapRouterContract({
  comptrollerAddress,
  chainId,
  signerOrProvider,
}: GetSwapRouterContractInput) {
  const address = getSwapRouterContractAddress({
    comptrollerAddress,
    chainId,
  });

  if (!address) {
    return undefined;
  }

  return new Contract(address, swapRouter.abi, signerOrProvider) as SwapRouterContractType;
}
