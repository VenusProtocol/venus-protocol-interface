import { type CreateProposalInput, createProposal, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

type Options = UseSendTransactionOptions<CreateProposalInput>;

const useCreateProposal = (options?: Options) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: FunctionKey.CREATE_PROPOSAL,
    fn: (input: CreateProposalInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        createProposal({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: async () => {
      queryClient.invalidateQueries(FunctionKey.GET_PROPOSAL_PREVIEWS);
    },
    options,
  });
};

export default useCreateProposal;
