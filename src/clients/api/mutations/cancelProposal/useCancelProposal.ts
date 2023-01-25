import { MutationObserverOptions, useMutation } from 'react-query';

import {
  CancelProposalInput,
  CancelProposalOutput,
  cancelProposal,
  queryClient,
} from 'clients/api';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useCancelProposal = (
  options?: MutationObserverOptions<
    CancelProposalOutput,
    Error,
    Omit<CancelProposalInput, 'governorBravoContract'>
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
