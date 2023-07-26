import { UniqueContractName, uniqueContractInfos } from '../contractInfos';
import { ChainId } from '../types';

export type GetUniqueContractAddressInput = {
  name: UniqueContractName;
  chainId: ChainId;
};

export function getUniqueContractAddress({ name, chainId }: GetUniqueContractAddressInput) {
  return uniqueContractInfos[name].address[chainId];
}
