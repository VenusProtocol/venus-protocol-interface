import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';

import {
  type GetPrimeLeaderboardInput,
  type GetPrimeLeaderboardOutput,
  getPrimeLeaderboard,
} from '.';

const refetchInterval = generatePseudoRandomRefetchInterval('fast');

type TrimmedInput = Omit<GetPrimeLeaderboardInput, 'chainId'>;

type Options = QueryObserverOptions<
  GetPrimeLeaderboardOutput,
  Error,
  GetPrimeLeaderboardOutput,
  GetPrimeLeaderboardOutput,
  [FunctionKey.GET_PRIME_LEADERBOARD, GetPrimeLeaderboardInput]
>;

export const useGetPrimeLeaderboard = (input: TrimmedInput = {}, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const params = { ...input, chainId };

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_LEADERBOARD, params],
    queryFn: () => getPrimeLeaderboard(params),
    placeholderData: keepPreviousData,
    refetchInterval,
    ...options,
  });
};
