import { useMutation, MutationObserverOptions } from 'react-query';

import { createProposal, ICreateProposalInput, CreateProposalOutput } from 'clients/api';
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
    options,
  );
};

export default useCreateProposal;
