import type { Provider } from '@ethersproject/abstract-provider';
import { Contract, Signer } from 'ethers';

import {
  UniqueContractName,
  UniqueContractTypeByName,
  uniqueContractInfos,
} from '../contractInfos';
import { getUniqueContractAddress } from '../getUniqueContractAddress';
import { ChainId } from '../types';

export interface GetUniqueContractInput<TContractName extends UniqueContractName> {
  name: TContractName;
  signerOrProvider: Signer | Provider;
  chainId: ChainId;
}

export function getUniqueContract<TContractName extends UniqueContractName>({
  name,
  signerOrProvider,
  chainId,
}: GetUniqueContractInput<TContractName>) {
  const address = getUniqueContractAddress({
    name,
    chainId,
  });

  if (!address) {
    return undefined;
  }

  return new Contract(
    address,
    uniqueContractInfos[name].abi,
    signerOrProvider,
  ) as UniqueContractTypeByName<TContractName>;
}
