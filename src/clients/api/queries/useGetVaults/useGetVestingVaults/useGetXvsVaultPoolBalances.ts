import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query';
import { getContractAddress, getTokenByAddress } from 'utilities';

import { GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

const XVS_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('xvsVaultProxy');

export interface UseGetXvsVaultPoolBalancesInput {
  stakedTokenAddresses: (string | undefined)[];
}

export type UseGetXvsVaultPoolBalancesOutput = UseQueryResult<GetBalanceOfOutput>[];

const useGetXvsVaultPoolBalances = ({
  stakedTokenAddresses,
}: UseGetXvsVaultPoolBalancesInput): UseGetXvsVaultPoolBalancesOutput => {
  const { provider } = useAuth();

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
            accountAddress: XVS_VAULT_PROXY_CONTRACT_ADDRESS,
          }),
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: XVS_VAULT_PROXY_CONTRACT_ADDRESS,
            tokenAddress: stakedToken?.address,
          },
        ],
        enabled: !!stakedToken,
        refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      };
    },
  );

  return useQueries(queries);
};

export default useGetXvsVaultPoolBalances;
