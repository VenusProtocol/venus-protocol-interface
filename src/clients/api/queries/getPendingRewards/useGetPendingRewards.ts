import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { useMulticall } from 'clients/web3';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

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
    mainPoolComptrollerContractAddress,
    isolatedPoolComptrollerAddresses,
    xvsVestingVaultPoolCount,
  }: Omit<
    GetPendingRewardGroupsInput,
    | 'multicall'
    | 'venusLensContractAddress'
    | 'poolLensContractAddress'
    | 'vaiVaultContractAddress'
    | 'xvsVaultContractAddress'
  >,
  options?: Options,
) => {
  const multicall = useMulticall();

  const venusLensContractAddress = useGetUniqueContractAddress({
    name: 'venusLens',
  });

  const poolLensContractAddress = useGetUniqueContractAddress({
    name: 'poolLens',
  });

  const vaiVaultContractAddress = useGetUniqueContractAddress({
    name: 'vaiVault',
  });

  const xvsVaultContractAddress = useGetUniqueContractAddress({
    name: 'xvsVault',
  });

  const resilientOracleContractAddress = useGetUniqueContractAddress({
    name: 'resilientOracle',
  });

  // Sort addresses to output the same data when providing them in a different
  // order. This prevents unnecessary queries
  const sortedIsolatedPoolComptrollerAddresses = [...isolatedPoolComptrollerAddresses].sort();

  return useQuery(
    [
      FunctionKey.GET_PENDING_REWARDS,
      accountAddress,
      xvsVestingVaultPoolCount,
      mainPoolComptrollerContractAddress,
      ...sortedIsolatedPoolComptrollerAddresses,
    ],
    () =>
      callOrThrow(
        {
          venusLensContractAddress,
          resilientOracleContractAddress,
          poolLensContractAddress,
          vaiVaultContractAddress,
          xvsVaultContractAddress,
        },
        params =>
          getPendingRewardGroups({
            mainPoolComptrollerContractAddress,
            isolatedPoolComptrollerAddresses,
            xvsVestingVaultPoolCount,
            multicall,
            accountAddress,
            ...params,
          }),
      ),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetPendingRewards;
