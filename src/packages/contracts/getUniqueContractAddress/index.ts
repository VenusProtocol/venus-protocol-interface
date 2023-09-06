import { ChainId } from 'types';

import { UniqueContractName, uniqueContractInfos } from '../contractInfos';

export type GetUniqueContractAddressInput = {
  name: UniqueContractName;
  chainId: ChainId;
};

export function getUniqueContractAddress({ name, chainId }: GetUniqueContractAddressInput) {
  return uniqueContractInfos[name].address[chainId];
}
