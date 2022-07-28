import { QueryObserverOptions, useQuery } from 'react-query';

import getProposalState, {
  GetProposalStateInput,
  GetProposalStateOutput,
} from 'clients/api/queries/getProposalState';
import { useGovernorBravoDelegateContract } from 'clients/contracts';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetProposalStateOutput,
  Error,
  GetProposalStateOutput,
  GetProposalStateOutput,
  [FunctionKey.GET_PROPOSAL_STATE, string]
>;

const useGetProposalState = (
  { proposalId }: Omit<GetProposalStateInput, 'governorBravoContract'>,
  options?: Options,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();
  return useQuery(
    [FunctionKey.GET_PROPOSAL_STATE, proposalId],
    () => getProposalState({ governorBravoContract, proposalId }),
    {
      staleTime: BLOCK_TIME_MS,
      ...options,
    },
  );
};

export default useGetProposalState;
