import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';

import { useWeb3 } from 'clients/web3';
import { getTokenContractByAddress } from 'clients/contracts';
import { getBalanceOf, GetBalanceOfOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { Bep20 } from 'types/contracts';
import { XVS_VAULT_PROXY_CONTRACT_ADDRESS } from './constants';

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
      const tokenContract = stakedTokenAddress
        ? getTokenContractByAddress(stakedTokenAddress, web3)
        : undefined;

      return {
        queryFn: () =>
          getBalanceOf({
            tokenContract: tokenContract || ({} as Bep20),
            accountAddress: XVS_VAULT_PROXY_CONTRACT_ADDRESS,
          }),
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          stakedTokenAddress,
          XVS_VAULT_PROXY_CONTRACT_ADDRESS,
        ],
        enabled: !!tokenContract,
      };
    },
  );

  return useQueries(queries);
};

export default useGetXvsVaultPoolBalances;
