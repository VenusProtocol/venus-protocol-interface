import type { Provider } from '@ethersproject/abstract-provider';
import { Contract, ContractInterface, Signer } from 'ethers';

export interface GenericContractGetterGeneratorInput {
  abi: ContractInterface;
}

export interface GenericContractGetterInput {
  address: string;
  signerOrProvider: Signer | Provider;
}

export type GenericContractGetter<TContract extends Contract> = (
  input: GenericContractGetterInput,
) => TContract | undefined;

export const genericContractGetterGenerator = <TContract extends Contract>({
  abi,
}: GenericContractGetterGeneratorInput) => {
  const getter: GenericContractGetter<TContract> = ({ signerOrProvider, address }) =>
    new Contract(address, abi, signerOrProvider) as TContract;

  return getter;
};
