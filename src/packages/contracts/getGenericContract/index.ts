import type { Provider } from '@ethersproject/abstract-provider';
import { Contract, Signer } from 'ethers';

import {
  GenericContractName,
  GenericContractTypeByName,
  genericContractInfos,
} from '../contractInfos';

export interface GetGenericContractInput<TContractName extends GenericContractName> {
  name: TContractName;
  signerOrProvider: Signer | Provider;
  address: string;
}

export function getGenericContract<TContractName extends GenericContractName>({
  name,
  signerOrProvider,
  address,
}: GetGenericContractInput<TContractName>) {
  return new Contract(
    address,
    genericContractInfos[name].abi,
    signerOrProvider,
  ) as GenericContractTypeByName<TContractName>;
}
