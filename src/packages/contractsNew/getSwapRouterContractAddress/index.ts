import { ChainId } from 'types';

import addresses from '../generated/infos/addresses';

export type GetSwapRouterContractAddressInput = {
  comptrollerContractAddress: string;
  chainId: ChainId;
};

export const getSwapRouterContractAddress = ({
  comptrollerContractAddress,
  chainId,
}: GetSwapRouterContractAddressInput) => {
  const swapRouterContractAddresses = addresses.SwapRouter[chainId];
  const sanitizedComptrollerAddress =
    comptrollerContractAddress.toLowerCase() as keyof typeof swapRouterContractAddresses;

  return swapRouterContractAddresses?.[sanitizedComptrollerAddress] as string | undefined;
};
