import { MutationObserverOptions, useMutation } from 'react-query';

import { CancelProposalOutput, ICancelProposalInput, cancelProposal } from 'clients/api';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useCancelProposal = (
  options?: MutationObserverOptions<
    CancelProposalOutput,
    Error,
    Omit<ICancelProposalInput, 'governorBravoContract'>
  >,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();
  return useMutation(
    FunctionKey.CANCEL_PROPOSAL,
    params =>
      cancelProposal({
        governorBravoContract,
        ...params,
      }),
    options,
  );
};

export default useCancelProposal;
