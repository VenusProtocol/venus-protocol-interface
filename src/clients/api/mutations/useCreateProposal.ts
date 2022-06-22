import { useMutation, MutationObserverOptions } from 'react-query';

import {
  queryClient,
  createProposal,
  ICreateProposalInput,
  CreateProposalOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';

const useCreateProposal = (
  options?: MutationObserverOptions<CreateProposalOutput, Error, ICreateProposalInput>,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();
  return useMutation(
    FunctionKey.CREATE_PROPOSAL,
    params =>
      createProposal({
        governorBravoContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Invalidate first page on success
        queryClient.invalidateQueries([FunctionKey.GET_PROPOSALS, { limit: 5, page: 0 }]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useCreateProposal;
