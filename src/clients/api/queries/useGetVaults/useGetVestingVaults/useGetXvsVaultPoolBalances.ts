import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query';
import { getContractAddress, getTokenByAddress } from 'utilities';

import { GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import { useWeb3 } from 'clients/web3';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

const XVS_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('xvsVaultProxy');

export interface UseGetXvsVaultPoolBalancesInput {
  stakedTokenAddresses: (string | undefined)[];
}

export type UseGetXvsVaultPoolBalancesOutput = UseQueryResult<GetBalanceOfOutput>[];

const useGetXvsVaultPoolBalances = ({
  stakedTokenAddresses,
}: UseGetXvsVaultPoolBalancesInput): UseGetXvsVaultPoolBalancesOutput => {
  const web3 = useWeb3();

  // Fetch total amount of tokens staked in each pool
  const queries: UseQueryOptions<GetBalanceOfOutput>[] = stakedTokenAddresses.map(
    stakedTokenAddress => {
      const stakedTokenId = stakedTokenAddress
        ? getTokenByAddress(stakedTokenAddress)?.id
        : undefined;

      return {
        queryFn: () =>
          getBalanceOf({
            web3,
            tokenId: stakedTokenId || '',
            accountAddress: XVS_VAULT_PROXY_CONTRACT_ADDRESS,
          }),
        queryKey: [FunctionKey.GET_BALANCE_OF, XVS_VAULT_PROXY_CONTRACT_ADDRESS, stakedTokenId],
        enabled: !!stakedTokenId,
        refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      };
    },
  );

  return useQueries(queries);
};

export default useGetXvsVaultPoolBalances;
