import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import { NULL_ADDRESS } from 'constants/address';
import FunctionKey from 'constants/functionKey';
import { useAccountAddress, useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { type GetInstitutionalVaultUserDataOutput, getInstitutionalVaultUserData } from '.';

export type UseGetInstitutionalVaultUserDataQueryKey = [
  FunctionKey.GET_INSTITUTIONAL_VAULT_USER_DATA,
  { chainId: ChainId; accountAddress: Address; vaultAddresses: Address[] },
];

export type UseGetInstitutionalVaultUserDataOptions<
  TSelectData = GetInstitutionalVaultUserDataOutput,
> = QueryObserverOptions<
  GetInstitutionalVaultUserDataOutput,
  Error,
  TSelectData,
  GetInstitutionalVaultUserDataOutput,
  UseGetInstitutionalVaultUserDataQueryKey
>;

export interface UseGetInstitutionalVaultUserDataInput {
  vaultAddresses: Address[];
}

export const useGetInstitutionalVaultUserData = <TSelectData = GetInstitutionalVaultUserDataOutput>(
  { vaultAddresses }: UseGetInstitutionalVaultUserDataInput,
  options?: Partial<UseGetInstitutionalVaultUserDataOptions<TSelectData>>,
) => {
  const { publicClient } = usePublicClient();
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  return useQuery({
    queryKey: [
      FunctionKey.GET_INSTITUTIONAL_VAULT_USER_DATA,
      { chainId, accountAddress: accountAddress ?? NULL_ADDRESS, vaultAddresses },
    ],
    queryFn: () =>
      callOrThrow({ accountAddress }, params =>
        getInstitutionalVaultUserData({
          publicClient,
          ...params,
          vaultAddresses,
        }),
      ),
    enabled: vaultAddresses.length > 0 && !!accountAddress,
    ...options,
  });
};
