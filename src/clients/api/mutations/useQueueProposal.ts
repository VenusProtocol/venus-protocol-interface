import { MutationObserverOptions, useMutation } from 'react-query';

import { IQueueProposalInput, QueueProposalOutput, queueProposal } from 'clients/api';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

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
