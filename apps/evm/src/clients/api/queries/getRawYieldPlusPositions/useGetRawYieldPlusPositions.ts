import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { ChainId } from '@venusprotocol/chains';

import {
  type GetRawYieldPlusPositionsInput,
  type GetRawYieldPlusPositionsOutput,
  getRawYieldPlusPositions,
} from 'clients/api/queries/getRawYieldPlusPositions';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetTokens } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetRawYieldPlusPositionsInput = Omit<
  GetRawYieldPlusPositionsInput,
  | 'chainId'
  | 'publicClient'
  | 'tokens'
  | 'venusLensContractAddress'
  | 'legacyPoolComptrollerContractAddress'
  | 'corePool'
>;

export type UseGetRawYieldPlusPositionsQueryKey = [
  FunctionKey.GET_RAW_YIELD_PLUS_POSITIONS,
  TrimmedGetRawYieldPlusPositionsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetRawYieldPlusPositionsOutput,
  Error,
  GetRawYieldPlusPositionsOutput,
  GetRawYieldPlusPositionsOutput,
  UseGetRawYieldPlusPositionsQueryKey
>;

export const useGetRawYieldPlusPositions = (
  input: TrimmedGetRawYieldPlusPositionsInput,
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
    queryKey: [FunctionKey.GET_RAW_YIELD_PLUS_POSITIONS, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ legacyPoolComptrollerContractAddress, venusLensContractAddress }, params =>
        getRawYieldPlusPositions({
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
