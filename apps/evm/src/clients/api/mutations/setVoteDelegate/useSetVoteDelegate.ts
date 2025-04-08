import { type SetVoteDelegateInput, queryClient, setVoteDelegate } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetXvsVaultContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

type TrimmedSetVoteDelegateInput = Omit<SetVoteDelegateInput, 'xvsVaultContract'>;
type Options = UseSendTransactionOptions<TrimmedSetVoteDelegateInput>;

const useSetVoteDelegate = (options?: Partial<Options>) => {
  const xvsVaultContract = useGetXvsVaultContract({
    passSigner: true,
  });

  return useSendTransaction({
    fn: (input: TrimmedSetVoteDelegateInput) =>
      callOrThrow({ xvsVaultContract }, params =>
        setVoteDelegate({
          ...params,
          ...input,
        }),
      ),
    onConfirmed: async () => {
      const accountAddress = await xvsVaultContract?.signer.getAddress();

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, { accountAddress }],
      });
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_CURRENT_VOTES, accountAddress],
      });
    },
    options,
  });
};

export default useSetVoteDelegate;
