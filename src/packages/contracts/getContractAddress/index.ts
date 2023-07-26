import { FixedAddressContractName, SwapRouterContractName, contractInfos } from '../contractInfos';
import { ChainId } from '../types';

export type GetContractAddressNameArg = FixedAddressContractName | SwapRouterContractName;

export type GetContractAddressVariablesArg<TContractName extends GetContractAddressNameArg> =
  TContractName extends SwapRouterContractName
    ? {
        comptrollerAddress: string;
        chainId: ChainId;
      }
    : {
        chainId: ChainId;
      };

export function getContractAddress<
  TContractName extends FixedAddressContractName | SwapRouterContractName,
>(name: TContractName, variables: GetContractAddressVariablesArg<TContractName>) {
  const contractAddress = contractInfos[name].address[variables.chainId];

  if (typeof contractAddress === 'string') {
    return contractAddress;
  }

  if (!contractAddress || !('comptrollerAddress' in variables)) {
    return undefined;
  }

  return contractAddress[variables.comptrollerAddress];
}
