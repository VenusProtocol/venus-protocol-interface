import type { Provider } from '@ethersproject/abstract-provider';
import { Contract, Signer } from 'ethers';

import { ContractName, ContractTypeByName } from '../types/contractName';

import * as contractInfos from '../contractInfos';

interface VariablesBase {
  signerOrProvider: Signer | Provider;
}

type Variables =
  | (VariablesBase & {
      chainId: number;
    })
  | (VariablesBase & {
      address: string;
    });

// TODO: handle case of swap router (need to map each swap router address to a comptroller
// address)

export default function getContract<TContractName extends ContractName>(
  name: TContractName,
  variables: Variables,
) {
  const contractInfo = contractInfos[name];
  let address: string | undefined;

  if ('address' in variables) {
    // Use address argument if it was passed
    ({ address } = variables);
  } else if (contractInfo.address) {
    // Otherwise retrieve address record using chainId
    address = contractInfo.address[variables.chainId];
  }

  // Return undefined if no address was passed or if no record could be retrieved using chainId
  if (!address) {
    return undefined;
  }

  return new Contract(
    address,
    contractInfo.abi,
    variables.signerOrProvider,
  ) as ContractTypeByName<TContractName>;
}
