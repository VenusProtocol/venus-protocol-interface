import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetVoteDelegateAddressInput,
  type GetVoteDelegateAddressOutput,
  getVoteDelegateAddress,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetVoteDelegateAddressInput = Omit<GetVoteDelegateAddressInput, 'xvsVaultContract'>;
type Options = QueryObserverOptions<
  GetVoteDelegateAddressOutput,
  Error,
  GetVoteDelegateAddressOutput,
  GetVoteDelegateAddressOutput,
  [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, TrimmedGetVoteDelegateAddressInput]
>;

const useGetVoteDelegateAddress = (
  input: TrimmedGetVoteDelegateAddressInput,
  options?: Partial<Options>,
) => {
  const xvsVaultContract = useGetXvsVaultContract({
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, input],

    queryFn: () =>
      callOrThrow({ xvsVaultContract }, params => getVoteDelegateAddress({ ...params, ...input })),

    ...options,
  });
};

export default useGetVoteDelegateAddress;
