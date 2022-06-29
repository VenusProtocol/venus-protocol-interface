import { useMutation, MutationObserverOptions } from 'react-query';

import { cancelProposal, ICancelProposalInput, CancelProposalOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';

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
