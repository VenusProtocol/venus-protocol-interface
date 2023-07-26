import { swapRouter } from '../contractInfos';
import { ChainId } from '../types';

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
