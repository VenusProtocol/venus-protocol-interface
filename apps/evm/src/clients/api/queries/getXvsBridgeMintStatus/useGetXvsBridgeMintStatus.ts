import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { ChainId } from '@venusprotocol/chains';
import { type GetXvsMintStatusOutput, getXvsBridgeMintStatus } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { getXVSProxyOFTDestContractAddress, getXvsTokenMultichainContract } from 'libs/contracts';
import { useProvider } from 'libs/wallet';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

interface UseGetXvsBridgeMintStatusInput {
  destinationChainId: ChainId;
}

export type UseGetTokenBalancesQueryKey = [
  FunctionKey.GET_XVS_BRIDGE_MINT_STATUS,
  UseGetXvsBridgeMintStatusInput,
];

type Options = QueryObserverOptions<
  GetXvsMintStatusOutput | undefined,
  Error,
  GetXvsMintStatusOutput | undefined,
  GetXvsMintStatusOutput | undefined,
  UseGetTokenBalancesQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetXvsBridgeMintStatus = (
  { destinationChainId }: UseGetXvsBridgeMintStatusInput,
  options?: Partial<Options>,
) => {
  const { provider } = useProvider({ chainId: destinationChainId });
  const xvsTokenMultichainContract = getXvsTokenMultichainContract({
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
      callOrThrow({ xvsTokenMultichainContract, chainXvsProxyOftDestContractAddress }, params =>
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

export default useGetXvsBridgeMintStatus;
