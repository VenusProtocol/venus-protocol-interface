import addresses from 'libs/contracts/generated/infos/addresses';
import type { UniqueContractName } from 'libs/contracts/generated/infos/types';
import type { ChainId } from 'types';

export type GetUniqueContractAddressInput = {
  name: UniqueContractName;
  chainId: ChainId;
};

export const getUniqueContractAddress = ({ name, chainId }: GetUniqueContractAddressInput) => {
  const contractAddresses = addresses[name];

  return Object.prototype.hasOwnProperty.call(contractAddresses, chainId)
    ? contractAddresses[chainId as keyof typeof contractAddresses]
    : undefined;
};
