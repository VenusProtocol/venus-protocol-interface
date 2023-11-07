import { useGetGovernorBravoDelegateContract } from 'packages/contracts';
import { callOrThrow } from 'utilities';

import { QueueProposalInput, queryClient, queueProposal } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedQueueProposalInput = Omit<QueueProposalInput, 'governorBravoDelegateContract'>;
type Options = UseSendTransactionOptions<TrimmedQueueProposalInput>;

const useQueueProposal = (options?: Options) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: FunctionKey.QUEUE_PROPOSAL,
    fn: (input: TrimmedQueueProposalInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        queueProposal({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: ({ input }) => {
      // Invalidate queries related to fetching the user minted VAI amount
      queryClient.invalidateQueries([
        FunctionKey.GET_PROPOSAL,
        {
          id: input.proposalId,
        },
      ]);
    },
    options,
  });
};

export default useQueueProposal;
