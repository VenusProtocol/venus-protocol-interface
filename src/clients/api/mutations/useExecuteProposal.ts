import { MutationObserverOptions, useMutation } from 'react-query';

import { ExecuteProposalOutput, IExecuteProposalInput, executeProposal } from 'clients/api';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useExecuteProposal = (
  options?: MutationObserverOptions<
    ExecuteProposalOutput,
    Error,
    Omit<IExecuteProposalInput, 'governorBravoContract'>
  >,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();

  return useMutation(
    FunctionKey.EXECUTE_PROPOSAL,
    params =>
      executeProposal({
        governorBravoContract,
        ...params,
      }),
    options,
  );
};

export default useExecuteProposal;
