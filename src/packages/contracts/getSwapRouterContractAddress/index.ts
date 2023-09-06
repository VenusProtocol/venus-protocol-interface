import { ChainId } from 'types';

import { swapRouter } from '../contractInfos';

export type GetSwapRouterContractAddressInput = {
  comptrollerAddress: string;
  chainId: ChainId;
};

export function getSwapRouterContractAddress({
  comptrollerAddress,
  chainId,
}: GetSwapRouterContractAddressInput) {
  return swapRouter.address[chainId]?.[comptrollerAddress.toLowerCase()];
}
