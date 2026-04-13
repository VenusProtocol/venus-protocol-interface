import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import FunctionKey from 'constants/functionKey';
import { useAccountAddress, useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import {
  type GetInstitutionalVaultMaxRedeemAmountOutput,
  getInstitutionalVaultMaxRedeemAmount,
} from '.';

export type UseGetInstitutionalVaultRewardAmountQueryKey = [
  FunctionKey.GET_INSTITUTIONAL_VAULT_REWARD_AMOUNT,
  { chainId: ChainId; accountAddress: Address | undefined; vaultAddress: Address },
];

type Options = QueryObserverOptions<
  GetInstitutionalVaultMaxRedeemAmountOutput,
  Error,
  GetInstitutionalVaultMaxRedeemAmountOutput,
  GetInstitutionalVaultMaxRedeemAmountOutput,
  UseGetInstitutionalVaultRewardAmountQueryKey
>;

export interface UseGetInstitutionalVaultMaxRedeemAmountInput {
  vaultAddress: Address;
}

export const useGetInstitutionalVaultMaxRedeemAmount = (
  { vaultAddress }: UseGetInstitutionalVaultMaxRedeemAmountInput,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient();
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  return useQuery({
    queryKey: [
      FunctionKey.GET_INSTITUTIONAL_VAULT_REWARD_AMOUNT,
      { chainId, accountAddress, vaultAddress },
    ],
    queryFn: () =>
      callOrThrow({ accountAddress }, params =>
        getInstitutionalVaultMaxRedeemAmount({
          publicClient,
          ...params,
          vaultAddress,
        }),
      ),
    enabled: !!accountAddress,
    ...options,
  });
};
