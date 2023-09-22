import type { Provider } from '@ethersproject/abstract-provider';
import { Contract, ContractInterface, Signer } from 'ethers';
import { ChainId } from 'types';

import getUniqueContractAddress, { UniqueContractName } from '../getUniqueContractAddress';

const uniqueContractGetter =
  <TContractType extends Contract>({
    name,
    abi,
  }: {
    name: UniqueContractName;
    abi: ContractInterface;
  }) =>
  ({ chainId, signerOrProvider }: { chainId: ChainId; signerOrProvider: Signer | Provider }) => {
    const address = getUniqueContractAddress({ name, chainId });

    return address ? (new Contract(address, abi, signerOrProvider) as TContractType) : undefined;
  };

export default uniqueContractGetter;
