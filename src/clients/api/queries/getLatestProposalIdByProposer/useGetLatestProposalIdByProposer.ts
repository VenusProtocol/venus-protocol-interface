import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getLatestProposalIdByProposer, {
  GetLatestProposalIdByProposerInput,
  GetLatestProposalIdByProposerOutput,
} from 'clients/api/queries/getLatestProposalIdByProposer';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type Options = QueryObserverOptions<
  GetLatestProposalIdByProposerOutput,
  Error,
  GetLatestProposalIdByProposerOutput,
  GetLatestProposalIdByProposerOutput,
  [FunctionKey.GET_LATEST_PROPOSAL_ID_BY_PROPOSER, string]
>;

const useGetLatestProposalIdByProposer = (
  { accountAddress }: Omit<GetLatestProposalIdByProposerInput, 'governorBravoDelegateContract'>,
  options?: Options,
) => {
  const governorBravoDelegateContract = useGetUniqueContract({
    name: 'governorBravoDelegate',
  });

  return useQuery(
    [FunctionKey.GET_LATEST_PROPOSAL_ID_BY_PROPOSER, accountAddress],
    () =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        getLatestProposalIdByProposer({
          accountAddress,
          ...params,
        }),
      ),
    {
      staleTime: BLOCK_TIME_MS,
      ...options,
    },
  );
};

export default useGetLatestProposalIdByProposer;
