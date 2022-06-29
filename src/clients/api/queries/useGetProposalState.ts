import { useQuery, QueryObserverOptions } from 'react-query';
import getProposalState, {
  IGetProposalStateInput,
  GetProposalStateOutput,
} from 'clients/api/queries/getProposalState';
import { useGovernorBravoDelegateContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';
import { BLOCK_VALIDATION_RATE_IN_SECONDS } from 'constants/bsc';

type Options = QueryObserverOptions<
  GetProposalStateOutput,
  Error,
  GetProposalStateOutput,
  GetProposalStateOutput,
  [FunctionKey.GET_PROPOSAL_STATE, string]
>;

const useGetProposalState = (
  { proposalId }: Omit<IGetProposalStateInput, 'governorBravoContract'>,
  options?: Options,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();
  return useQuery(
    [FunctionKey.GET_PROPOSAL_STATE, proposalId],
    () => getProposalState({ governorBravoContract, proposalId }),
    {
      staleTime: BLOCK_VALIDATION_RATE_IN_SECONDS,
      ...options,
    },
  );
};

export default useGetProposalState;
