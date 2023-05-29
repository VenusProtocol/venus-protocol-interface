import { MutationObserverOptions, useMutation } from 'react-query';

import {
  SetVoteDelegateInput,
  SetVoteDelegateOutput,
  queryClient,
  setVoteDelegate,
} from 'clients/api';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useSetVoteDelegate = (
  options?: MutationObserverOptions<
    SetVoteDelegateOutput,
    Error,
    Omit<SetVoteDelegateInput, 'xvsVaultContract'>
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
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await xvsVaultContract.signer.getAddress();

        queryClient.invalidateQueries([FunctionKey.GET_VOTE_DELEGATE_ADDRESS, { accountAddress }]);
        queryClient.invalidateQueries([FunctionKey.GET_CURRENT_VOTES, accountAddress]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSetVoteDelegate;
