import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetVoteDelegateAddressOutput,
  IGetVoteDelegateAddressInput,
  getVoteDelegateAddress,
} from 'clients/api';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVoteDelegateAddressOutput,
  Error,
  GetVoteDelegateAddressOutput,
  GetVoteDelegateAddressOutput,
  [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, Omit<IGetVoteDelegateAddressInput, 'xvsVaultContract'>]
>;

const useGetVoteDelegateAddress = (
  { accountAddress }: Omit<IGetVoteDelegateAddressInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, { accountAddress }],
    () => getVoteDelegateAddress({ xvsVaultContract, accountAddress }),
    options,
  );
};

export default useGetVoteDelegateAddress;
