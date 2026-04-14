import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import { NULL_ADDRESS } from 'constants/address';
import FunctionKey from 'constants/functionKey';
import { useAccountAddress, useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import {
  type GetFixedRatedVaultUserStakedTokensOutput,
  getFixedRatedVaultUserStakedTokens,
} from '.';

export type UseGetFixedRatedVaultUserStakedTokensQueryKey = [
  FunctionKey.GET_FIXED_RATED_VAULTS_USER_STAKED_TOKENS,
  { chainId: ChainId; accountAddress: Address; vaultAddresses: Address[] },
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
      { chainId, accountAddress: accountAddress ?? NULL_ADDRESS, vaultAddresses },
    ],
    queryFn: () =>
      callOrThrow({ accountAddress }, params =>
        getFixedRatedVaultUserStakedTokens({
          publicClient,
          ...params,
          vaultAddresses,
        }),
      ),
    enabled: vaultAddresses.length > 0 && !!accountAddress,
    ...options,
  });
};
