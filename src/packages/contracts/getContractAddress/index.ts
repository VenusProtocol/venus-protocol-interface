import fixedAddressContractInfos, {
  FixedAddressContractName,
} from '../contractInfos/fixedAddressContractInfos';
import swapRouter, { SwapRouterContractName } from '../contractInfos/swapRouterContractInfos';
import { ChainId } from '../types';

const contractInfos = {
  // We don't list generic contracts since by definition they don't have a fixed address defined
  ...fixedAddressContractInfos,
  swapRouter,
};

type ContractName = keyof typeof contractInfos;

type Variables<TContractName extends ContractName> = TContractName extends SwapRouterContractName
  ? {
      comptrollerAddress: string;
      chainId: ChainId;
    }
  : {
      chainId: ChainId;
    };

export default function getContractAddress<
  TContractName extends FixedAddressContractName | SwapRouterContractName,
>(name: TContractName, variables: Variables<TContractName>) {
  const contractAddress = contractInfos[name].address[variables.chainId];

  if (typeof contractAddress === 'string') {
    return contractAddress;
  }

  if (!contractAddress || !('comptrollerAddress' in variables)) {
    return undefined;
  }

  return contractAddress[variables.comptrollerAddress];
}
