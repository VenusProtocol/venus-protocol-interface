import addresses from 'packages/contractsNew/infos/addresses';
import { ChainId } from 'types';

export type GetSwapRouterContractAddressInput = {
  comptrollerAddress: string;
  chainId: ChainId;
};

const getSwapRouterContractAddress = ({
  comptrollerAddress,
  chainId,
}: GetSwapRouterContractAddressInput) => {
  const swapRouterContractAddresses = addresses.SwapRouter[chainId];
  const sanitizedComptrollerAddress =
    comptrollerAddress.toLowerCase() as keyof typeof swapRouterContractAddresses;

  return swapRouterContractAddresses?.[sanitizedComptrollerAddress] as string | undefined;
};

export default getSwapRouterContractAddress;
