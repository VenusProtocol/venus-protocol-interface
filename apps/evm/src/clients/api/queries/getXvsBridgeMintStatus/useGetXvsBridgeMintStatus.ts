import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getXVSProxyOFTDestContractAddress, getXvsTokenOmnichainContract } from 'libs/contracts';
import { useProvider } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';
import { type GetXvsMintStatusOutput, getXvsBridgeMintStatus } from '.';

interface UseGetXvsBridgeMintStatusInput {
  destinationChainId: ChainId;
}

export type UseGetXvsBridgeMintStatusQueryKey = [
  FunctionKey.GET_XVS_BRIDGE_MINT_STATUS,
  UseGetXvsBridgeMintStatusInput,
];

type Options = QueryObserverOptions<
  GetXvsMintStatusOutput | undefined,
  Error,
  GetXvsMintStatusOutput | undefined,
  GetXvsMintStatusOutput | undefined,
  UseGetXvsBridgeMintStatusQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetXvsBridgeMintStatus = (
  { destinationChainId }: UseGetXvsBridgeMintStatusInput,
  options?: Partial<Options>,
) => {
  const { provider } = useProvider({ chainId: destinationChainId });
  const xvsTokenOmnichainContract = getXvsTokenOmnichainContract({
    chainId: destinationChainId,
    signerOrProvider: provider,
  });
  const chainXvsProxyOftDestContractAddress = getXVSProxyOFTDestContractAddress({
    chainId: destinationChainId,
  });

  return useQuery({
    queryKey: [
      FunctionKey.GET_XVS_BRIDGE_MINT_STATUS,
      {
        destinationChainId,
      },
    ],

    queryFn: () =>
      callOrThrow({ xvsTokenOmnichainContract, chainXvsProxyOftDestContractAddress }, params =>
        getXvsBridgeMintStatus({ ...params }),
      ),

    refetchInterval,
    ...options,

    enabled:
      destinationChainId !== ChainId.BSC_MAINNET &&
      destinationChainId !== ChainId.BSC_TESTNET &&
      options?.enabled,
  });
};
