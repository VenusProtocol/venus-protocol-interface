import type { Provider } from '@ethersproject/abstract-provider';
import { Contract, Signer } from 'ethers';

import fixedAddressContractInfos, {
  FixedAddressContractName,
  FixedAddressContractTypeByName,
} from '../contractInfos/fixedAddressContractInfos';
import genericContractInfos, {
  GenericContractName,
  GenericContractTypeByName,
} from '../contractInfos/genericContractInfos';
import swapRouter, {
  SwapRouterContractName,
  SwapRouterContractType,
} from '../contractInfos/swapRouterContractInfos';
import getContractAddress from '../getContractAddress';
import { ChainId } from '../types';

const contractInfos = {
  ...fixedAddressContractInfos,
  ...genericContractInfos,
  swapRouter,
};

type ContractName = keyof typeof contractInfos;

type ContractTypeByName<TContractName extends ContractName> =
  TContractName extends FixedAddressContractName
    ? FixedAddressContractTypeByName<TContractName>
    : TContractName extends GenericContractName
    ? GenericContractTypeByName<TContractName>
    : TContractName extends SwapRouterContractName
    ? SwapRouterContractType
    : never;

interface VariablesBase {
  signerOrProvider: Signer | Provider;
}

type Variables<TContractName extends ContractName> = TContractName extends SwapRouterContractName
  ? VariablesBase & {
      comptrollerAddress: string;
      chainId: ChainId;
    }
  : TContractName extends FixedAddressContractName
  ? VariablesBase & {
      chainId: ChainId;
    }
  : VariablesBase & {
      address: string;
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
