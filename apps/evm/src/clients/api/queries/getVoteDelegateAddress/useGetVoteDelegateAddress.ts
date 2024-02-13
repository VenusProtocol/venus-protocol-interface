import { useGetXvsVaultContract } from 'libs/contracts';
import { governanceChain } from 'libs/wallet';
import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetVoteDelegateAddressInput,
  GetVoteDelegateAddressOutput,
  getVoteDelegateAddress,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
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
  options?: Options,
) => {
  const xvsVaultContract = useGetXvsVaultContract({
    chainId: governanceChain.id,
  });

  return useQuery(
    [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, input],
    () =>
      callOrThrow({ xvsVaultContract }, params => getVoteDelegateAddress({ ...params, ...input })),
    options,
  );
};

export default useGetVoteDelegateAddress;
