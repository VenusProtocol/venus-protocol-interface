import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { ChainId } from '@venusprotocol/chains';

import {
  type GetRawTradePositionsInput,
  type GetRawTradePositionsOutput,
  getRawTradePositions,
} from 'clients/api/queries/getRawTradePositions';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetTokens } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';

type TrimmedGetRawTradePositionsInput = Omit<
  GetRawTradePositionsInput,
  | 'chainId'
  | 'publicClient'
  | 'tokens'
  | 'venusLensContractAddress'
  | 'legacyPoolComptrollerContractAddress'
  | 'corePool'
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export type UseGetRawTradePositionsQueryKey = [
  FunctionKey.GET_RAW_TRADE_POSITIONS,
  TrimmedGetRawTradePositionsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetRawTradePositionsOutput,
  Error,
  GetRawTradePositionsOutput,
  GetRawTradePositionsOutput,
  UseGetRawTradePositionsQueryKey
>;

export const useGetRawTradePositions = (
  input: TrimmedGetRawTradePositionsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  const { publicClient } = usePublicClient();

  const tokens = useGetTokens({
    chainId,
  });

  const { address: legacyPoolComptrollerContractAddress } = useGetContractAddress({
    name: 'LegacyPoolComptroller',
  });

  const { address: venusLensContractAddress } = useGetContractAddress({
    name: 'VenusLens',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_RAW_TRADE_POSITIONS, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ legacyPoolComptrollerContractAddress, venusLensContractAddress }, params =>
        getRawTradePositions({
          chainId,
          publicClient,
          tokens,
          ...params,
          ...input,
        }),
      ),
    refetchInterval,
    ...options,
  });
};
