import { useCallback } from 'react';
import { QueryObserverOptions, useQuery } from 'react-query';

import { GetXvsMintStatusOutput, getXvsBridgeMintStatus } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import {
  getXVSProxyOFTDestContractAddress,
  getXvsTokenMultichainContract,
} from 'packages/contracts';
import { useProvider } from 'packages/wallet';
import { ChainId } from 'types';
import { generatePseudoRandomRefetchInterval } from 'utilities';

interface UseGetXvsBridgeFeeInput {
  destinationChain: ChainId;
}

export type UseGetTokenBalancesQueryKey = [
  FunctionKey.GET_XVS_BRIDGE_MINT_STATUS,
  UseGetXvsBridgeFeeInput,
];

type Options = QueryObserverOptions<
  GetXvsMintStatusOutput | undefined,
  Error,
  GetXvsMintStatusOutput | undefined,
  GetXvsMintStatusOutput | undefined,
  UseGetTokenBalancesQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetXvsBridgeFeeEstimation = (
  { destinationChain }: UseGetXvsBridgeFeeInput,
  options?: Options,
) => {
  const { provider } = useProvider({ chainId: destinationChain });
  const xvsTokenMultichainContract = getXvsTokenMultichainContract({
    chainId: destinationChain,
    signerOrProvider: provider,
  });
  const chainXvsProxyOftDestContractAddress = getXVSProxyOFTDestContractAddress({
    chainId: destinationChain,
  });
  const getXvsBridgeMintStatusIfAvailable = useCallback(() => {
    if (xvsTokenMultichainContract && chainXvsProxyOftDestContractAddress) {
      return getXvsBridgeMintStatus({
        xvsTokenMultichainContract,
        chainXvsProxyOftDestContractAddress,
      });
    }
    return undefined;
  }, [xvsTokenMultichainContract, chainXvsProxyOftDestContractAddress]);

  return useQuery(
    [
      FunctionKey.GET_XVS_BRIDGE_MINT_STATUS,
      {
        destinationChain,
      },
    ],
    () => getXvsBridgeMintStatusIfAvailable(),
    {
      refetchInterval,
      ...options,
    },
  );
};

export default useGetXvsBridgeFeeEstimation;
