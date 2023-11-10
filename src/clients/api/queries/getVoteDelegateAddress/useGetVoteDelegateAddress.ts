import { useGetXvsVaultContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import {
  GetVoteDelegateAddressInput,
  GetVoteDelegateAddressOutput,
  getVoteDelegateAddress,
} from 'clients/api';
import { governanceChain } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

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
