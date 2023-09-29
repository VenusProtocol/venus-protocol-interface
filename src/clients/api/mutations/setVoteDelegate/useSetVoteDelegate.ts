import { useGetXvsVaultContract } from 'packages/contractsNew';
import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import {
  SetVoteDelegateInput,
  SetVoteDelegateOutput,
  queryClient,
  setVoteDelegate,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';

type TrimmedSetVoteDelegateInput = Omit<SetVoteDelegateInput, 'xvsVaultContract'>;
type Options = MutationObserverOptions<SetVoteDelegateOutput, Error, TrimmedSetVoteDelegateInput>;

const useSetVoteDelegate = (options?: Options) => {
  const xvsVaultContract = useGetXvsVaultContract({
    passSigner: true,
  });

  return useMutation(
    FunctionKey.SET_VOTE_DELEGATE,
    (input: TrimmedSetVoteDelegateInput) =>
      callOrThrow({ xvsVaultContract }, params =>
        setVoteDelegate({
          ...params,
          ...input,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await xvsVaultContract?.signer.getAddress();

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
