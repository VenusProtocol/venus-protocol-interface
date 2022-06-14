import { useMutation, MutationObserverOptions } from 'react-query';

import queryClient from 'clients/api/queryClient';
import { setVoteDelegate, ISetVoteDelegateInput, SetVoteDelegateOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';

const useSetVoteDelegate = (
  options?: MutationObserverOptions<
    SetVoteDelegateOutput,
    Error,
    Omit<ISetVoteDelegateInput, 'xvsVaultContract'>
  >,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();
  return useMutation(
    FunctionKey.SET_VOTE_DELEGATE,
    params =>
      setVoteDelegate({
        xvsVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_VOTE_DELEGATE_ADDRESS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSetVoteDelegate;
