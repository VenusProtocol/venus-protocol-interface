import { type ExecuteProposalInput, executeProposal, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

type TrimmedExecuteProposalInput = Omit<ExecuteProposalInput, 'governorBravoDelegateContract'>;
type Options = UseSendTransactionOptions<TrimmedExecuteProposalInput>;

const useExecuteProposal = (options?: Options) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: FunctionKey.EXECUTE_PROPOSAL,
    fn: (input: TrimmedExecuteProposalInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        executeProposal({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: async ({ input }) => {
      queryClient.invalidateQueries(FunctionKey.GET_PROPOSALS);
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

export default useExecuteProposal;
