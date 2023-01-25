import { MutationObserverOptions, useMutation } from 'react-query';

import { QueueProposalInput, QueueProposalOutput, queryClient, queueProposal } from 'clients/api';
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
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { proposalId } = onSuccessParams[1];

        // Invalidate queries related to fetching the user minted VAI amount
        queryClient.invalidateQueries([
          FunctionKey.GET_PROPOSAL,
          {
            id: proposalId,
          },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useQueueProposal;
