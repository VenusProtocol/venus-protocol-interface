import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';

import {
  type GetPrimeRewardsLeaderboardInput,
  type GetPrimeRewardsLeaderboardOutput,
  getPrimeRewardsLeaderboard,
} from '.';

type TrimmedInput = Omit<GetPrimeRewardsLeaderboardInput, 'chainId'>;

type Options = QueryObserverOptions<
  GetPrimeRewardsLeaderboardOutput,
  Error,
  GetPrimeRewardsLeaderboardOutput,
  GetPrimeRewardsLeaderboardOutput,
  [FunctionKey.GET_PRIME_REWARDS_LEADERBOARD, GetPrimeRewardsLeaderboardInput]
>;

export const useGetPrimeRewardsLeaderboard = (
  input: TrimmedInput = {},
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const params = { ...input, chainId };

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_REWARDS_LEADERBOARD, params],
    queryFn: () => getPrimeRewardsLeaderboard(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};
