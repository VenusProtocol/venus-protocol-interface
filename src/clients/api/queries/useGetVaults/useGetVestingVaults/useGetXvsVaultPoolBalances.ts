import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query';

import { GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import useGetTokens from 'hooks/useGetTokens';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';
import findTokenByAddress from 'utilities/findTokenByAddress';

export interface UseGetXvsVaultPoolBalancesInput {
  stakedTokenAddresses: (string | undefined)[];
}

export type UseGetXvsVaultPoolBalancesOutput = UseQueryResult<GetBalanceOfOutput>[];

const useGetXvsVaultPoolBalances = ({
  stakedTokenAddresses,
}: UseGetXvsVaultPoolBalancesInput): UseGetXvsVaultPoolBalancesOutput => {
  const { provider } = useAuth();
  const tokens = useGetTokens();

  const xvsVaultContractAddress = useGetUniqueContractAddress({
    name: 'xvsVault',
  });

  // Fetch total amount of tokens staked in each pool
  const queries: UseQueryOptions<GetBalanceOfOutput>[] = stakedTokenAddresses.map(
    stakedTokenAddress => {
      const stakedToken = stakedTokenAddress
        ? findTokenByAddress({ tokens, address: stakedTokenAddress })
        : undefined;

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
      };
    },
  );

  return useQueries(queries);
};

export default useGetXvsVaultPoolBalances;
