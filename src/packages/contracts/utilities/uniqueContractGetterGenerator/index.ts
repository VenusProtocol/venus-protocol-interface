import type { Provider } from '@ethersproject/abstract-provider';
import { Contract, ContractInterface, Signer } from 'ethers';
import { UniqueContractName } from 'packages/contracts/generated/infos/types';
import { ChainId } from 'types';

import { getUniqueContractAddress } from 'packages/contracts/utilities/getUniqueContractAddress';

export interface UniqueContractGetterGeneratorInput {
  name: UniqueContractName;
  abi: ContractInterface;
}

export interface UniqueContractGetterInput {
  chainId: ChainId;
  signerOrProvider: Signer | Provider;
}

export type UniqueContractGetter<TContract extends Contract> = (
  input: UniqueContractGetterInput,
) => TContract | undefined;

export const uniqueContractGetterGenerator = <TContract extends Contract>({
  name,
  abi,
}: UniqueContractGetterGeneratorInput) => {
  const getter: UniqueContractGetter<TContract> = ({ chainId, signerOrProvider }) => {
    const address = getUniqueContractAddress({ name, chainId });
    return address ? (new Contract(address, abi, signerOrProvider) as TContract) : undefined;
  };

  return getter;
};
