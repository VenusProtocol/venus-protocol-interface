import { MutationObserverOptions, useMutation } from 'react-query';

import { CreateProposalOutput, ICreateProposalInput, createProposal } from 'clients/api';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

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
