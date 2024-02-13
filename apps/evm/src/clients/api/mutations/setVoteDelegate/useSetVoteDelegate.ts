import { useGetXvsVaultContract } from 'libs/contracts';

import { SetVoteDelegateInput, queryClient, setVoteDelegate } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { callOrThrow } from 'utilities';

type TrimmedSetVoteDelegateInput = Omit<SetVoteDelegateInput, 'xvsVaultContract'>;
type Options = UseSendTransactionOptions<TrimmedSetVoteDelegateInput>;

const useSetVoteDelegate = (options?: Options) => {
  const xvsVaultContract = useGetXvsVaultContract({
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: FunctionKey.SET_VOTE_DELEGATE,
    fn: (input: TrimmedSetVoteDelegateInput) =>
      callOrThrow({ xvsVaultContract }, params =>
        setVoteDelegate({
          ...params,
          ...input,
        }),
      ),
    onConfirmed: async () => {
      const accountAddress = await xvsVaultContract?.signer.getAddress();

      queryClient.invalidateQueries([FunctionKey.GET_VOTE_DELEGATE_ADDRESS, { accountAddress }]);
      queryClient.invalidateQueries([FunctionKey.GET_CURRENT_VOTES, accountAddress]);
    },
    options,
  });
};

export default useSetVoteDelegate;
