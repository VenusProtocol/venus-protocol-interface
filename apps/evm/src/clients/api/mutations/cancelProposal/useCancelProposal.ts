import { type CancelProposalInput, cancelProposal, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

type TrimmedCancelProposalInput = Omit<CancelProposalInput, 'governorBravoDelegateContract'>;
type Options = UseSendTransactionOptions<TrimmedCancelProposalInput>;

const useCancelProposal = (options?: Options) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: FunctionKey.CANCEL_PROPOSAL,
    fn: (input: TrimmedCancelProposalInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        cancelProposal({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: ({ input }) => {
      queryClient.invalidateQueries(FunctionKey.GET_PROPOSAL_PREVIEWS);
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

export default useCancelProposal;
