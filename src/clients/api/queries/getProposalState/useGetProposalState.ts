import { useGetGovernorBravoDelegateContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getProposalState, {
  GetProposalStateInput,
  GetProposalStateOutput,
} from 'clients/api/queries/getProposalState';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';

type TrimmedGetProposalStateInput = Omit<GetProposalStateInput, 'governorBravoDelegateContract'>;

type Options = QueryObserverOptions<
  GetProposalStateOutput,
  Error,
  GetProposalStateOutput,
  GetProposalStateOutput,
  [FunctionKey.GET_PROPOSAL_STATE, TrimmedGetProposalStateInput]
>;

const useGetProposalState = (input: TrimmedGetProposalStateInput, options?: Options) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract();

  return useQuery(
    [FunctionKey.GET_PROPOSAL_STATE, input],
    () =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        getProposalState({
          ...input,
          ...params,
        }),
      ),
    {
      staleTime: BLOCK_TIME_MS,
      ...options,
    },
  );
};

export default useGetProposalState;
