import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getXvsVaultContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { governanceChain } from 'libs/wallet';
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
  const xvsVaultAddress = getXvsVaultContractAddress({
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, input],
    queryFn: () =>
      callOrThrow({ publicClient, xvsVaultAddress }, params =>
        getVoteDelegateAddress({ ...params, ...input }),
      ),
    ...options,
    enabled: !!xvsVaultAddress && (options?.enabled === undefined || options?.enabled),
  });
};
