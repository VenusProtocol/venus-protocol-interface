import { useQuery, QueryObserverOptions } from 'react-query';

import getProposalThreshold, {
  GetProposalThresholdOutput,
} from 'clients/api/queries/getProposalThreshold';
import FunctionKey from 'constants/functionKey';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';

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
