import { uniqueContractAddresses } from 'packages/contractsNew/generated/contractInfos/addresses';
import { ChainId } from 'types';

export type UniqueContractName = keyof typeof uniqueContractAddresses;

export type GetSwapRouterContractAddressInput = {
  comptrollerAddress: string;
  chainId: ChainId;
};

// TODO: fix
const getSwapRouterContractAddress = ({
  comptrollerAddress,
  chainId,
}: GetSwapRouterContractAddressInput) =>
  swapRouter.address[chainId]?.[comptrollerAddress.toLowerCase()];

export default getSwapRouterContractAddress;
