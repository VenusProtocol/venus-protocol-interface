import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetVoteDelegateAddressInput,
  GetVoteDelegateAddressOutput,
  getVoteDelegateAddress,
} from 'clients/api';
import { useXvsVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVoteDelegateAddressOutput,
  Error,
  GetVoteDelegateAddressOutput,
  GetVoteDelegateAddressOutput,
  [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, Omit<GetVoteDelegateAddressInput, 'xvsVaultContract'>]
>;

const useGetVoteDelegateAddress = (
  { accountAddress }: Omit<GetVoteDelegateAddressInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, { accountAddress }],
    () => getVoteDelegateAddress({ xvsVaultContract, accountAddress }),
    options,
  );
};

export default useGetVoteDelegateAddress;
