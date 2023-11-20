import { useGetGovernorBravoDelegateContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getLatestProposalIdByProposer, {
  GetLatestProposalIdByProposerInput,
  GetLatestProposalIdByProposerOutput,
} from 'clients/api/queries/getLatestProposalIdByProposer';
import { governanceChain } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

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
  const { blockTimeMs } = useGetChainMetadata();

  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    chainId: governanceChain.id,
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
      staleTime: blockTimeMs,
      ...options,
    },
  );
};

export default useGetLatestProposalIdByProposer;
