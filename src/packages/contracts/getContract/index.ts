import type { Provider } from '@ethersproject/abstract-provider';
import { Contract, Signer } from 'ethers';

import { ContractName, ContractTypeByName } from '../types/contractName';
import { ChainId } from '../types/general';

import * as contractInfos from '../contractInfos';
import getContractAddress from '../getContractAddress';

interface VariablesBase {
  signerOrProvider: Signer | Provider;
}

type Variables<TContractName extends ContractName> = TContractName extends 'swapRouter'
  ? VariablesBase & {
      comptrollerAddress: string;
    }
  : TContractName extends 'isolatedPoolComptroller'
  ? VariablesBase & {
      address: string;
    }
  : VariablesBase & {
      chainId: ChainId;
    };

export default function getContract<TContractName extends ContractName>(
  name: TContractName,
  variables: Variables<TContractName>,
) {
  const contractInfo = contractInfos[name];
  let address: string | undefined;

  if ('address' in variables) {
    // Handle generic contracts
    ({ address } = variables);
  } else if ('chainId' in variables) {
    // Handle fixed address contracts
    address = getContractAddress(name, variables);

    // TODO: Handle swap router contracts
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
