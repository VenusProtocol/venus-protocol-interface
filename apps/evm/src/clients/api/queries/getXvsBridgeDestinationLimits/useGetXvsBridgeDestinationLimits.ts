import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId, usePublicClient } from 'libs/wallet';
import { ChainId } from 'types';
import callOrThrow from 'utilities/callOrThrow';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import {
  type GetXvsBridgeDestinationLimitsInput,
  type GetXvsBridgeDestinationLimitsOutput,
  getXvsBridgeDestinationLimits,
} from '.';

type TrimmedGetXvsBridgeDestinationLimitsInput = Omit<
  GetXvsBridgeDestinationLimitsInput,
  'bridgeContractAddress' | 'publicClient'
>;

export type UseGetXvsBridgeDestinationLimitsQueryKey = [
  FunctionKey.GET_XVS_BRIDGE_DESTINATION_LIMITS,
  { chainId: ChainId; toChainIds: ChainId[] },
];

type Options = QueryObserverOptions<
  GetXvsBridgeDestinationLimitsOutput,
  Error,
  GetXvsBridgeDestinationLimitsOutput,
  GetXvsBridgeDestinationLimitsOutput,
  UseGetXvsBridgeDestinationLimitsQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetXvsBridgeDestinationLimits = (
  { toChainIds }: TrimmedGetXvsBridgeDestinationLimitsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  const { address: bridgeContractSrcAddress } = useGetContractAddress({
    name: 'XVSProxyOFTSrc',
  });
  const { address: bridgeContractDestAddress } = useGetContractAddress({
    name: 'XVSProxyOFTDest',
  });

  const bridgeContractAddress =
    chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
      ? bridgeContractSrcAddress
      : bridgeContractDestAddress;

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_BRIDGE_DESTINATION_LIMITS, { chainId, toChainIds }],
    queryFn: () =>
      callOrThrow({ bridgeContractAddress }, params =>
        getXvsBridgeDestinationLimits({
          ...params,
          toChainIds,
          publicClient,
        }),
      ),
    refetchInterval,
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && toChainIds.length > 0,
  });
};
