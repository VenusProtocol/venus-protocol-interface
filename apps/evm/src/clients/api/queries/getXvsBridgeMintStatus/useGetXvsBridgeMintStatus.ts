import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
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
  const { publicClient } = usePublicClient({ chainId: destinationChainId });

  const xvsTokenOmnichainContractAddress = getContractAddress({
    name: 'XvsTokenOmnichain',
    chainId: destinationChainId,
  });

  const chainXvsProxyOftDestContractAddress = getContractAddress({
    name: 'XVSProxyOFTDest',
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
      callOrThrow(
        {
          chainXvsProxyOftDestContractAddress,
          xvsTokenOmnichainContractAddress,
        },
        params =>
          getXvsBridgeMintStatus({
            ...params,
            publicClient,
          }),
      ),
    refetchInterval,
    ...options,
    enabled:
      (options?.enabled === undefined || options.enabled) &&
      destinationChainId !== ChainId.BSC_MAINNET &&
      destinationChainId !== ChainId.BSC_TESTNET,
  });
};
