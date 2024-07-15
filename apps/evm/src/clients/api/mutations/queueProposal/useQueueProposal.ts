import { type QueueProposalInput, queryClient, queueProposal } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

type TrimmedQueueProposalInput = Omit<QueueProposalInput, 'governorBravoDelegateContract'>;
type Options = UseSendTransactionOptions<TrimmedQueueProposalInput>;

const useQueueProposal = (options?: Partial<Options>) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: [FunctionKey.QUEUE_PROPOSAL],
    fn: (input: TrimmedQueueProposalInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        queueProposal({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: ({ input }) => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_PROPOSAL_PREVIEWS],
      });
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_PROPOSAL,
          {
            id: input.proposalId,
          },
        ],
      });
    },
    options,
  });
};

export default useQueueProposal;
