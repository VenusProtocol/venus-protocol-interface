import addresses from 'packages/contracts/generated/infos/addresses';
import { UniqueContractName } from 'packages/contracts/generated/infos/types';
import { ChainId } from 'types';

export type GetUniqueContractAddressInput = {
  name: UniqueContractName;
  chainId: ChainId;
};

export const getUniqueContractAddress = ({ name, chainId }: GetUniqueContractAddressInput) => {
  const contractAddresses = addresses[name];

  return Object.hasOwn(contractAddresses, chainId)
    ? contractAddresses[chainId as keyof typeof contractAddresses]
    : undefined;
};
