import addresses from 'packages/contracts/generated/infos/addresses';
import { ChainId } from 'types';

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
