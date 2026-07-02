import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import { type GetPrimeTokenLimitOutput, getPrimeTokenLimit } from '.';

type Options = QueryObserverOptions<
  GetPrimeTokenLimitOutput,
  Error,
  GetPrimeTokenLimitOutput,
  GetPrimeTokenLimitOutput,
  [FunctionKey.GET_PRIME_TOKEN_LIMIT, { chainId: ChainId }]
>;

export const useGetPrimeTokenLimit = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { address: primeV2ContractAddress } = useGetContractAddress({ name: 'PrimeV2' });

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_TOKEN_LIMIT, { chainId }],
    queryFn: () =>
      callOrThrow({ primeV2ContractAddress }, params =>
        getPrimeTokenLimit({ publicClient, ...params }),
      ),
    ...options,
  });
};
