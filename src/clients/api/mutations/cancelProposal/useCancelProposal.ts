import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import {
  CancelProposalInput,
  CancelProposalOutput,
  cancelProposal,
  queryClient,
} from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedCancelProposalInput = Omit<CancelProposalInput, 'governorBravoDelegateContract'>;
type Options = MutationObserverOptions<CancelProposalOutput, Error, TrimmedCancelProposalInput>;

const useCancelProposal = (options?: Options) => {
  const governorBravoDelegateContract = useGetUniqueContract({
    name: 'governorBravoDelegate',
  });

  return useMutation(
    FunctionKey.CANCEL_PROPOSAL,
    (input: TrimmedCancelProposalInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        cancelProposal({
          ...input,
          ...params,
        }),
      ),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { proposalId } = onSuccessParams[1];

        queryClient.invalidateQueries([
          FunctionKey.GET_PROPOSAL,
          {
            id: proposalId,
          },
        ]);
      },
    },
  );
};

export default useCancelProposal;
