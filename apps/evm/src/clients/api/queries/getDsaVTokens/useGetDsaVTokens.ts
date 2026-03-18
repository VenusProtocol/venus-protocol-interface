import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { type GetDsaVTokensOutput, getDsaVTokens } from '.';

export type UseGetDsaVTokensQueryKey = [FunctionKey.GET_DSA_V_TOKENS, { chainId: ChainId }];

type Options = QueryObserverOptions<
  GetDsaVTokensOutput | undefined,
  Error,
  GetDsaVTokensOutput | undefined,
  GetDsaVTokensOutput | undefined,
  UseGetDsaVTokensQueryKey
>;

export const useGetDsaVTokens = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  const { address: relativePositionManagerAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_DSA_V_TOKENS, { chainId }],
    queryFn: () =>
      callOrThrow({ relativePositionManagerAddress }, params =>
        getDsaVTokens({
          publicClient,
          ...params,
        }),
      ),
    ...options,
  });
};
