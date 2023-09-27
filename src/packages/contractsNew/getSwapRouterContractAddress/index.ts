import addresses from 'packages/contractsNew/infos/addresses';
import { ChainId } from 'types';

export type GetSwapRouterContractAddressInput = {
  comptrollerContractAddress: string;
  chainId: ChainId;
};

const getSwapRouterContractAddress = ({
  comptrollerContractAddress,
  chainId,
}: GetSwapRouterContractAddressInput) => {
  const swapRouterContractAddresses = addresses.SwapRouter[chainId];
  const sanitizedComptrollerAddress =
    comptrollerContractAddress.toLowerCase() as keyof typeof swapRouterContractAddresses;

  return swapRouterContractAddresses?.[sanitizedComptrollerAddress] as string | undefined;
};

export default getSwapRouterContractAddress;
