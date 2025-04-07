import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import {
  useGetLegacyPoolComptrollerContractAddress,
  useGetPoolLensContractAddress,
  useGetPoolRegistryContractAddress,
  useGetVenusLensContractAddress,
} from 'libs/contracts';
import { useGetTokens } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { type GetVTokensOutput, getVTokens } from '.';

export type UseGetVTokensQueryKey = [
  FunctionKey.GET_VTOKENS,
  {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetVTokensOutput,
  Error,
  GetVTokensOutput,
  GetVTokensOutput,
  UseGetVTokensQueryKey
>;

export const useGetVTokens = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const tokens = useGetTokens();

  const { publicClient } = usePublicClient();
  const venusLensContractAddress = useGetVenusLensContractAddress();
  const legacyPoolComptrollerContractAddress = useGetLegacyPoolComptrollerContractAddress();
  const poolLensContractAddress = useGetPoolLensContractAddress();
  const poolRegistryContractAddress = useGetPoolRegistryContractAddress();

  return useQuery({
    queryKey: [
      FunctionKey.GET_VTOKENS,
      {
        chainId,
      },
    ],

    queryFn: () =>
      callOrThrow({ poolLensContractAddress, poolRegistryContractAddress }, params =>
        getVTokens({
          publicClient,
          chainId,
          legacyPoolComptrollerContractAddress,
          venusLensContractAddress,
          tokens,
          ...params,
        }),
      ),

    ...options,
  });
};
