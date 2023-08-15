import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query';
import { getTokenByAddress } from 'utilities';

import { GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

export interface UseGetXvsVaultPoolBalancesInput {
  stakedTokenAddresses: (string | undefined)[];
}

export type UseGetXvsVaultPoolBalancesOutput = UseQueryResult<GetBalanceOfOutput>[];

const useGetXvsVaultPoolBalances = ({
  stakedTokenAddresses,
}: UseGetXvsVaultPoolBalancesInput): UseGetXvsVaultPoolBalancesOutput => {
  const { provider } = useAuth();

  const xvsVaultContractAddress = useGetUniqueContractAddress({
    name: 'xvsVault',
  });

  // Fetch total amount of tokens staked in each pool
  const queries: UseQueryOptions<GetBalanceOfOutput>[] = stakedTokenAddresses.map(
    stakedTokenAddress => {
      const stakedToken = stakedTokenAddress ? getTokenByAddress(stakedTokenAddress) : undefined;

      return {
        queryFn: () =>
          getBalanceOf({
            provider,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            token: stakedToken!,
            accountAddress: xvsVaultContractAddress || '',
          }),
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: xvsVaultContractAddress,
            tokenAddress: stakedToken?.address,
          },
        ],
        enabled: !!stakedToken && !!xvsVaultContractAddress,
        refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      };
    },
  );

  return useQueries(queries);
};

export default useGetXvsVaultPoolBalances;
