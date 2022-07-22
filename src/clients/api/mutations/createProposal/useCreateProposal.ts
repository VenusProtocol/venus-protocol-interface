import { MutationObserverOptions, useMutation } from 'react-query';

import { CreateProposalInput, CreateProposalOutput, createProposal } from 'clients/api';
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
    options,
  );
};

export default useCreateProposal;
