import { MutationObserverOptions, useMutation } from 'react-query';

import {
  CreateProposalInput,
  CreateProposalOutput,
  createProposal,
  queryClient,
} from 'clients/api';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useCreateProposal = (
  options?: MutationObserverOptions<CreateProposalOutput, Error, CreateProposalInput>,
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
        queryClient.invalidateQueries(FunctionKey.GET_PROPOSALS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useCreateProposal;
