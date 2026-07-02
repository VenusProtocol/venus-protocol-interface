import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';

import { type GetPrimeDepositsOutput, getPrimeDeposits } from '.';

interface UseGetPrimeDepositsInput {
  accountAddress?: Address;
}

export type UseGetPrimeDepositsQueryKey = [
  FunctionKey.GET_PRIME_DEPOSITS,
  UseGetPrimeDepositsInput & { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetPrimeDepositsOutput,
  Error,
  GetPrimeDepositsOutput,
  GetPrimeDepositsOutput,
  UseGetPrimeDepositsQueryKey
>;

export const useGetPrimeDeposits = (
  { accountAddress }: UseGetPrimeDepositsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { address: primeLeaderboardContractAddress } = useGetContractAddress({
    name: 'PrimeLeaderboard',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_DEPOSITS, { accountAddress, chainId }],
    queryFn: () =>
      callOrThrow({ accountAddress, primeLeaderboardContractAddress }, params =>
        getPrimeDeposits({ publicClient, ...params }),
      ),
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && !!accountAddress,
  });
};
