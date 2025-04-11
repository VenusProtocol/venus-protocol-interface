import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import {
  getXVSProxyOFTDestContractAddress,
  getXVSProxyOFTSrcContractAddress,
} from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';
import { type GetXvsBridgeStatusInput, type GetXvsBridgeStatusOutput, getXvsBridgeStatus } from '.';

type TrimmedGetXvsBridgeStatusInput = Omit<
  GetXvsBridgeStatusInput,
  | 'fromChainBridgeContractAddress'
  | 'toChainBridgeContractAddress'
  | 'fromChainPublicClient'
  | 'toChainPublicClient'
  | 'fromChainId'
>;

export type UseGetXvsBridgeStatusQueryKey = [
  FunctionKey.GET_XVS_BRIDGE_STATUS,
  { chainId: ChainId; toChainId: ChainId },
];

type Options = QueryObserverOptions<
  GetXvsBridgeStatusOutput,
  Error,
  GetXvsBridgeStatusOutput,
  GetXvsBridgeStatusOutput,
  UseGetXvsBridgeStatusQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetXvsBridgeStatus = (
  { toChainId }: TrimmedGetXvsBridgeStatusInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient: fromChainPublicClient } = usePublicClient();
  const { publicClient: toChainPublicClient } = usePublicClient({ chainId: toChainId });

  const fromChainBridgeContractSrcAddress = getXVSProxyOFTSrcContractAddress({ chainId });
  const fromChainBridgeContractDestAddress = getXVSProxyOFTDestContractAddress({ chainId });
  const toChainBridgeContractSrcAddress = getXVSProxyOFTSrcContractAddress({
    chainId: toChainId,
  });
  const toChainBridgeContractDestAddress = getXVSProxyOFTDestContractAddress({
    chainId: toChainId,
  });

  const fromChainBridgeContractAddress =
    chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
      ? fromChainBridgeContractSrcAddress
      : fromChainBridgeContractDestAddress;

  const toChainBridgeContractAddress =
    toChainId === ChainId.BSC_MAINNET || toChainId === ChainId.BSC_TESTNET
      ? toChainBridgeContractSrcAddress
      : toChainBridgeContractDestAddress;

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_BRIDGE_STATUS, { chainId, toChainId }],
    queryFn: () =>
      callOrThrow(
        {
          fromChainBridgeContractAddress,
          toChainBridgeContractAddress,
          toChainId,
          fromChainId: chainId,
        },
        params =>
          getXvsBridgeStatus({
            ...params,
            fromChainPublicClient,
            toChainPublicClient,
          }),
      ),
    refetchInterval,
    ...options,
  });
};
