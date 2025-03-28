import { type UseQueryOptions, type UseQueryResult, useQueries } from '@tanstack/react-query';

import { type GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContractAddress } from 'libs/contracts';
import { useGetTokens } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import findTokenByAddress from 'utilities/findTokenByAddress';

export interface UseGetXvsVaultPoolBalancesInput {
  stakedTokenAddresses: (string | undefined)[];
}

export type UseGetXvsVaultPoolBalancesOutput = UseQueryResult<GetBalanceOfOutput>[];

export const useGetXvsVaultPoolBalances = ({
  stakedTokenAddresses,
}: UseGetXvsVaultPoolBalancesInput): UseGetXvsVaultPoolBalancesOutput => {
  const { publicClient } = usePublicClient();
  const { chainId } = useChainId();
  const tokens = useGetTokens();

  const xvsVaultContractAddress = useGetXvsVaultContractAddress();

  // Fetch total amount of tokens staked in each pool
  const queries: UseQueryOptions<GetBalanceOfOutput>[] = stakedTokenAddresses.map(
    stakedTokenAddress => {
      const stakedToken = stakedTokenAddress
        ? findTokenByAddress({ tokens, address: stakedTokenAddress })
        : undefined;

      return {
        queryFn: () =>
          callOrThrow(
            {
              token: stakedToken,
              accountAddress: xvsVaultContractAddress,
            },
            params =>
              getBalanceOf({
                publicClient,
                ...params,
              }),
          ),
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress: xvsVaultContractAddress,
            tokenAddress: stakedToken?.address,
          },
        ],
        enabled: !!stakedToken && !!xvsVaultContractAddress,
      };
    },
  );

  return useQueries({ queries });
};
