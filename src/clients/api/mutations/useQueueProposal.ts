import { useMutation, MutationObserverOptions } from 'react-query';

import { queueProposal, IQueueProposalInput, QueueProposalOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';

const useQueueProposal = (
  options?: MutationObserverOptions<
    QueueProposalOutput,
    Error,
    Omit<IQueueProposalInput, 'governorBravoContract'>
  >,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();
  return useMutation(
    FunctionKey.QUEUE_PROPOSAL,
    params =>
      queueProposal({
        governorBravoContract,
        ...params,
      }),
    options,
  );
};

export default useQueueProposal;
