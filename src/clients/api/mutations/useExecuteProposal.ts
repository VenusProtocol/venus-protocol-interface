import { useMutation, MutationObserverOptions } from 'react-query';

import { executeProposal, IExecuteProposalInput, ExecuteProposalOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';

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
