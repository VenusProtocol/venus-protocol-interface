import { useGetGovernorBravoDelegateContract } from 'packages/contracts';
import { callOrThrow } from 'utilities';

import { ExecuteProposalInput, executeProposal } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

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
    options,
  });
};

export default useExecuteProposal;
