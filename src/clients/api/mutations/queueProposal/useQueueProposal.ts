import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { QueueProposalInput, QueueProposalOutput, queryClient, queueProposal } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type TrimmedQueueProposalInput = Omit<QueueProposalInput, 'governorBravoDelegateContract'>;
type Options = MutationObserverOptions<QueueProposalOutput, Error, TrimmedQueueProposalInput>;

const useQueueProposal = (options?: Options) => {
  const governorBravoDelegateContract = useGetUniqueContract({
    name: 'governorBravoDelegate',
  });

  return useMutation(
    FunctionKey.QUEUE_PROPOSAL,
    (input: TrimmedQueueProposalInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        queueProposal({
          ...input,
          ...params,
        }),
      ),
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
