import { type QueryObserverOptions, useQuery } from 'react-query';

import getProposalThreshold, {
  type GetProposalThresholdOutput,
} from 'clients/api/queries/getProposalThreshold';
import FunctionKey from 'constants/functionKey';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type Options = QueryObserverOptions<
  GetProposalThresholdOutput,
  Error,
  GetProposalThresholdOutput,
  GetProposalThresholdOutput,
  FunctionKey.GET_PROPOSAL_THRESHOLD
>;

const useGetProposalThreshold = (options?: Options) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    chainId: governanceChain.id,
  });

  return useQuery(
    FunctionKey.GET_PROPOSAL_THRESHOLD,
    () => callOrThrow({ governorBravoDelegateContract }, getProposalThreshold),
    options,
  );
};

export default useGetProposalThreshold;
