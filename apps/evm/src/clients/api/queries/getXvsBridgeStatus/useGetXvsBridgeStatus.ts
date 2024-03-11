import { type QueryObserverOptions, useQuery } from 'react-query';

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

type TrimmedGetXvsBridgeStatusInput = Omit<GetXvsBridgeStatusInput, 'tokenBridgeContract'>;

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

const useGetBridgeStatus = ({ toChainId }: TrimmedGetXvsBridgeStatusInput, options?: Options) => {
  const { chainId } = useChainId();
  const tokenBridgeContractSrc = useGetXVSProxyOFTSrcContract({ chainId });
  const tokenBridgeContractDest = useGetXVSProxyOFTDestContract({ chainId });
  const tokenBridgeContract =
    chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
      ? tokenBridgeContractSrc
      : tokenBridgeContractDest;

  return useQuery(
    [FunctionKey.GET_XVS_BRIDGE_STATUS, { chainId, toChainId }],
    () =>
      callOrThrow({ tokenBridgeContract, toChainId }, params => getXvsBridgeStatus({ ...params })),
    {
      refetchInterval,
      ...options,
      enabled: options?.enabled === undefined || options?.enabled,
    },
  );
};

export default useGetBridgeStatus;
