import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
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
  const { address: venusLensContractAddress } = useGetContractAddress({
    name: 'VenusLens',
  });
  const { address: legacyPoolComptrollerContractAddress } = useGetContractAddress({
    name: 'LegacyPoolComptroller',
  });
  const { address: poolLensContractAddress } = useGetContractAddress({
    name: 'PoolLens',
  });
  const { address: poolRegistryContractAddress } = useGetContractAddress({
    name: 'PoolRegistry',
  });

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
