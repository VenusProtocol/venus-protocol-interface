import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { governanceChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import {
  type GetVoteDelegateAddressInput,
  type GetVoteDelegateAddressOutput,
  getVoteDelegateAddress,
} from '.';

type TrimmedGetVoteDelegateAddressInput = Omit<
  GetVoteDelegateAddressInput,
  'publicClient' | 'xvsVaultAddress'
>;

type Options = QueryObserverOptions<
  GetVoteDelegateAddressOutput,
  Error,
  GetVoteDelegateAddressOutput,
  GetVoteDelegateAddressOutput,
  [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, TrimmedGetVoteDelegateAddressInput]
>;

export const useGetVoteDelegateAddress = (
  input: TrimmedGetVoteDelegateAddressInput,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient();
  const xvsVaultAddress = getContractAddress({
    name: 'XvsVault',
    chainId: governanceChainId,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, input],
    queryFn: () =>
      callOrThrow({ xvsVaultAddress }, params =>
        getVoteDelegateAddress({ ...params, ...input, publicClient }),
      ),
    ...options,
    enabled: !!xvsVaultAddress && (options?.enabled === undefined || options?.enabled),
  });
};
