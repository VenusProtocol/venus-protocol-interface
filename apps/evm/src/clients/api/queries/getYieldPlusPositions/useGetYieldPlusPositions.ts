import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { ChainId } from '@venusprotocol/chains';

import {
  type GetYieldPlusPositionsInput,
  type GetYieldPlusPositionsOutput,
  getYieldPlusPositions,
} from 'clients/api/queries/getYieldPlusPositions';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetTokens } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetYieldPlusPositionsInput = Omit<
  GetYieldPlusPositionsInput,
  | 'chainId'
  | 'publicClient'
  | 'tokens'
  | 'venusLensContractAddress'
  | 'legacyPoolComptrollerContractAddress'
>;

export type UseGetYieldPlusPositionsQueryKey = [
  FunctionKey.GET_YIELD_PLUS_POSITIONS,
  TrimmedGetYieldPlusPositionsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetYieldPlusPositionsOutput,
  Error,
  GetYieldPlusPositionsOutput,
  GetYieldPlusPositionsOutput,
  UseGetYieldPlusPositionsQueryKey
>;

export const useGetYieldPlusPositions = (
  input: TrimmedGetYieldPlusPositionsInput,
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
    queryKey: [FunctionKey.GET_YIELD_PLUS_POSITIONS, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ legacyPoolComptrollerContractAddress, venusLensContractAddress }, params =>
        getYieldPlusPositions({
          chainId,
          publicClient,
          tokens,
          ...params,
          ...input,
        }),
      ),
    ...options,
  });
};
