import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getProposalThreshold, {
  GetProposalThresholdOutput,
} from 'clients/api/queries/getProposalThreshold';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetProposalThresholdOutput,
  Error,
  GetProposalThresholdOutput,
  GetProposalThresholdOutput,
  FunctionKey.GET_PROPOSAL_THRESHOLD
>;

const useGetProposalThreshold = (options?: Options) => {
  const governorBravoDelegateContract = useGetUniqueContract({
    name: 'governorBravoDelegate',
  });

  return useQuery(
    FunctionKey.GET_PROPOSAL_THRESHOLD,
    () => callOrThrow({ governorBravoDelegateContract }, getProposalThreshold),
    options,
  );
};

export default useGetProposalThreshold;
