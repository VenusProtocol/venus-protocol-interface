import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetXvsBridgeStatusInput,
  type GetXvsBridgeStatusOutput,
  getXvsBridgeStatus,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetXVSProxyOFTDestContract, useGetXVSProxyOFTSrcContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

type TrimmedGetXvsBridgeStatusInput = Omit<
  GetXvsBridgeStatusInput,
  'tokenBridgeSendingContract' | 'receivingEndBridgeContract' | 'fromChainId'
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

const useGetBridgeStatus = (
  { toChainId }: TrimmedGetXvsBridgeStatusInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const tokenBridgeContractSrc = useGetXVSProxyOFTSrcContract({ chainId });
  const tokenBridgeContractDest = useGetXVSProxyOFTDestContract({ chainId });
  const receivingEndBridgeContractSrc = useGetXVSProxyOFTSrcContract({ chainId: toChainId });
  const receivingEndBridgeContractDest = useGetXVSProxyOFTDestContract({ chainId: toChainId });
  const tokenBridgeSendingContract =
    chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
      ? tokenBridgeContractSrc
      : tokenBridgeContractDest;

  const receivingEndBridgeContract =
    toChainId === ChainId.BSC_MAINNET || toChainId === ChainId.BSC_TESTNET
      ? receivingEndBridgeContractSrc
      : receivingEndBridgeContractDest;

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_BRIDGE_STATUS, { chainId, toChainId }],

    queryFn: () =>
      callOrThrow(
        { tokenBridgeSendingContract, receivingEndBridgeContract, toChainId, fromChainId: chainId },
        params => getXvsBridgeStatus({ ...params }),
      ),

    refetchInterval,
    ...options,
    enabled: options?.enabled === undefined || options?.enabled,
  });
};

export default useGetBridgeStatus;
