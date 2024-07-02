import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

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
  [FunctionKey.GET_PROPOSAL_THRESHOLD]
>;

const useGetProposalThreshold = (options?: Partial<Options>) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_THRESHOLD],
    queryFn: () => callOrThrow({ governorBravoDelegateContract }, getProposalThreshold),
    ...options,
  });
};

export default useGetProposalThreshold;
