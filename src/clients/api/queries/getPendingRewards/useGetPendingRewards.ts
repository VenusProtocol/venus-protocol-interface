import { QueryObserverOptions, useQuery } from 'react-query';

import { useMulticall } from 'clients/web3';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

import getPendingRewardGroups from '.';
import { GetPendingRewardGroupsInput, GetPendingRewardGroupsOutput } from './types';

type Options = QueryObserverOptions<
  GetPendingRewardGroupsOutput,
  Error,
  GetPendingRewardGroupsOutput,
  GetPendingRewardGroupsOutput,
  [FunctionKey.GET_PENDING_REWARDS, string, number, ...string[]]
>;

const useGetPendingRewards = (
  {
    accountAddress,
    mainPoolComptrollerAddress,
    isolatedPoolComptrollerAddresses,
    xvsVestingVaultPoolCount,
  }: Omit<GetPendingRewardGroupsInput, 'multicall'>,
  options?: Options,
) => {
  const multicall = useMulticall();

  // Sort addresses to output the same data when providing them in a different
  // order. This prevents unnecessary queries
  const sortedIsolatedPoolComptrollerAddresses = [...isolatedPoolComptrollerAddresses].sort();

  return useQuery(
    [
      FunctionKey.GET_PENDING_REWARDS,
      accountAddress,
      xvsVestingVaultPoolCount,
      mainPoolComptrollerAddress,
      ...sortedIsolatedPoolComptrollerAddresses,
    ],
    () =>
      getPendingRewardGroups({
        mainPoolComptrollerAddress,
        isolatedPoolComptrollerAddresses,
        xvsVestingVaultPoolCount,
        multicall,
        accountAddress,
      }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetPendingRewards;
