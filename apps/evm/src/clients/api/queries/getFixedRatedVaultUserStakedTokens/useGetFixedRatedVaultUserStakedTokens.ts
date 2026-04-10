import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import FunctionKey from 'constants/functionKey';
import { useAccountAddress, useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetFixedRatedVaultUserStakedTokensOutput,
  getFixedRatedVaultUserStakedTokens,
} from '.';

export type UseGetFixedRatedVaultUserStakedTokensQueryKey = [
  FunctionKey.GET_FIXED_RATED_VAULTS_USER_STAKED_TOKENS,
  { chainId: ChainId; accountAddress: Address | undefined; vaultAddresses: Address[] },
];

type Options = QueryObserverOptions<
  GetFixedRatedVaultUserStakedTokensOutput,
  Error,
  GetFixedRatedVaultUserStakedTokensOutput,
  GetFixedRatedVaultUserStakedTokensOutput,
  UseGetFixedRatedVaultUserStakedTokensQueryKey
>;

export interface UseGetFixedRatedVaultUserStakedTokensInput {
  vaultAddresses: Address[];
}

export const useGetFixedRatedVaultUserStakedTokens = (
  { vaultAddresses }: UseGetFixedRatedVaultUserStakedTokensInput,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient();
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  return useQuery({
    queryKey: [
      FunctionKey.GET_FIXED_RATED_VAULTS_USER_STAKED_TOKENS,
      { chainId, accountAddress, vaultAddresses },
    ],
    queryFn: () =>
      getFixedRatedVaultUserStakedTokens({
        publicClient,
        accountAddress: accountAddress as Address,
        vaultAddresses,
      }),
    enabled: vaultAddresses.length > 0,
    ...options,
  });
};
