import { MutationObserverOptions, useMutation } from 'react-query';

import { QueueProposalInput, QueueProposalOutput, queueProposal } from 'clients/api';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useQueueProposal = (
  options?: MutationObserverOptions<
    QueueProposalOutput,
    Error,
    Omit<QueueProposalInput, 'governorBravoContract'>
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
