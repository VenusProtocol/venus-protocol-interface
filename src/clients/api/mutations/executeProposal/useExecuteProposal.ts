import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { ExecuteProposalInput, ExecuteProposalOutput, executeProposal } from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedExecuteProposalInput = Omit<ExecuteProposalInput, 'governorBravoDelegateContract'>;
type Options = MutationObserverOptions<ExecuteProposalOutput, Error, TrimmedExecuteProposalInput>;

const useExecuteProposal = (options?: Options) => {
  const governorBravoDelegateContract = useGetUniqueContract({
    name: 'governorBravoDelegate',
  });

  return useMutation(
    FunctionKey.EXECUTE_PROPOSAL,
    (input: TrimmedExecuteProposalInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        executeProposal({
          ...input,
          ...params,
        }),
      ),
    options,
  );
};

export default useExecuteProposal;
