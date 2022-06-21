import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';

import { useWeb3 } from 'clients/web3';
import { getTokenContractByAddress } from 'clients/contracts';
import { getBalanceOf, GetBalanceOfOutput } from 'clients/api';
import { getTokenByAddress, getContractAddress } from 'utilities';
import FunctionKey from 'constants/functionKey';
import { Bep20 } from 'types/contracts';

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
      const tokenContract = stakedTokenAddress
        ? getTokenContractByAddress(stakedTokenAddress, web3)
        : undefined;

      const stakedTokenId = stakedTokenAddress
        ? getTokenByAddress(stakedTokenAddress)?.id
        : undefined;

      return {
        queryFn: () =>
          getBalanceOf({
            tokenContract: tokenContract || ({} as Bep20),
            accountAddress: XVS_VAULT_PROXY_CONTRACT_ADDRESS,
          }),
        queryKey: [FunctionKey.GET_BALANCE_OF, XVS_VAULT_PROXY_CONTRACT_ADDRESS, stakedTokenId],
        enabled: !!tokenContract,
      };
    },
  );

  return useQueries(queries);
};

export default useGetXvsVaultPoolBalances;
