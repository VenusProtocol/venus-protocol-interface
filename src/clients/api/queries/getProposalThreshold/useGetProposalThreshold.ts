import { QueryObserverOptions, useQuery } from 'react-query';

import getProposalThreshold, {
  GetProposalThresholdOutput,
} from 'clients/api/queries/getProposalThreshold';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetProposalThresholdOutput,
  Error,
  GetProposalThresholdOutput,
  GetProposalThresholdOutput,
  FunctionKey.GET_PROPOSAL_THRESHOLD
>;

const useGetProposalThreshold = (options?: Options) => {
  const governorBravoContract = useGovernorBravoDelegateContract();
  return useQuery(
    FunctionKey.GET_PROPOSAL_THRESHOLD,
    () => getProposalThreshold({ governorBravoContract }),
    options,
  );
};

export default useGetProposalThreshold;
