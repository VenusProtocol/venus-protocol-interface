import { QueryObserverOptions, useQuery } from 'react-query';

import { GetXvsBridgeStatusInput, GetXvsBridgeStatusOutput, getXvsBridgeStatus } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetXVSProxyOFTDestContract, useGetXVSProxyOFTSrcContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

type TrimmedGetXvsBridgeStatusInput = Omit<GetXvsBridgeStatusInput, 'tokenBridgeContract'>;

export type UseGetXvsBridgeStatusQueryKey = [
  FunctionKey.GET_XVS_BRIDGE_STATUS,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetXvsBridgeStatusOutput,
  Error,
  GetXvsBridgeStatusOutput,
  GetXvsBridgeStatusOutput,
  UseGetXvsBridgeStatusQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetPrimeStatus = ({ toChainId }: TrimmedGetXvsBridgeStatusInput, options?: Options) => {
  const { chainId } = useChainId();
  const tokenBridgeContractSrc = useGetXVSProxyOFTSrcContract({ chainId });
  const tokenBridgeContractDest = useGetXVSProxyOFTDestContract({ chainId });
  const tokenBridgeContract =
    chainId === ChainId.SEPOLIA || chainId === ChainId.ETHEREUM
      ? tokenBridgeContractDest
      : tokenBridgeContractSrc;

  return useQuery(
    [FunctionKey.GET_XVS_BRIDGE_STATUS, { chainId }],
    () =>
      callOrThrow({ tokenBridgeContract, toChainId }, params => getXvsBridgeStatus({ ...params })),
    {
      refetchInterval,
      ...options,
      enabled: options?.enabled === undefined || options?.enabled,
    },
  );
};

export default useGetPrimeStatus;
