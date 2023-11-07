import { useGetGovernorBravoDelegateContract } from 'packages/contracts';
import { callOrThrow } from 'utilities';

import { CreateProposalInput, createProposal, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

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
      queryClient.invalidateQueries(FunctionKey.GET_PROPOSALS);
    },
    options,
  });
};

export default useCreateProposal;
