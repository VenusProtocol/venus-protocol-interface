import { useQuery, QueryObserverOptions } from 'react-query';
import getLatestProposalIdByProposer, {
  IGetLatestProposalIdByProposerInput,
  GetLatestProposalIdByProposerOutput,
} from 'clients/api/queries/getLatestProposalIdByProposer';
import { useGovernorBravoDelegateContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';
import { BLOCK_TIME_MS } from 'constants/bsc';

type Options = QueryObserverOptions<
  GetLatestProposalIdByProposerOutput,
  Error,
  GetLatestProposalIdByProposerOutput,
  GetLatestProposalIdByProposerOutput,
  [FunctionKey.GET_LATEST_PROPOSAL_ID_BY_PROPOSER, string]
>;

const useGetLatestProposalIdByProposer = (
  { accountAddress }: Omit<IGetLatestProposalIdByProposerInput, 'governorBravoContract'>,
  options?: Options,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();
  return useQuery(
    [FunctionKey.GET_LATEST_PROPOSAL_ID_BY_PROPOSER, accountAddress],
    () => getLatestProposalIdByProposer({ governorBravoContract, accountAddress }),
    {
      staleTime: BLOCK_TIME_MS,
      ...options,
    },
  );
};

export default useGetLatestProposalIdByProposer;
