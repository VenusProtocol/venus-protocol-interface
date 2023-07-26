import type { Provider } from '@ethersproject/abstract-provider';
import { Contract, Signer } from 'ethers';

import {
  ContractName,
  ContractTypeByName,
  FixedAddressContractName,
  SwapRouterContractName,
  contractInfos,
} from '../contractInfos';
import { getContractAddress } from '../getContractAddress';
import { ChainId } from '../types';

export type GetContractNameArg = ContractName;

interface VariablesArgBase {
  signerOrProvider: Signer | Provider;
}

export type GetContractVariablesArg<TContractName extends GetContractNameArg> =
  TContractName extends SwapRouterContractName
    ? VariablesArgBase & {
        comptrollerAddress: string;
        chainId: ChainId;
      }
    : TContractName extends FixedAddressContractName
    ? VariablesArgBase & {
        chainId: ChainId;
      }
    : VariablesArgBase & {
        address: string;
      };

export function getContract<TContractName extends GetContractNameArg>(
  name: TContractName,
  variables: GetContractVariablesArg<TContractName>,
) {
  const contractInfo = contractInfos[name];
  let address: string | undefined;

  if ('address' in variables) {
    // Handle generic contracts
    ({ address } = variables);
  } else {
    // Handle other contracts
    address = getContractAddress(name as FixedAddressContractName, variables);
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
