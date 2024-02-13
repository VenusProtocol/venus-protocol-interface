import { QueryObserverOptions, useQuery } from 'react-query';

import getProposalState, {
  GetProposalStateInput,
  GetProposalStateOutput,
} from 'clients/api/queries/getProposalState';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import FunctionKey from 'constants/functionKey';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetProposalStateInput = Omit<GetProposalStateInput, 'governorBravoDelegateContract'>;

type Options = QueryObserverOptions<
  GetProposalStateOutput,
  Error,
  GetProposalStateOutput,
  GetProposalStateOutput,
  [FunctionKey.GET_PROPOSAL_STATE, TrimmedGetProposalStateInput]
>;

const useGetProposalState = (input: TrimmedGetProposalStateInput, options?: Options) => {
  const { blockTimeMs } = CHAIN_METADATA[governanceChain.id];
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    chainId: governanceChain.id,
  });

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
      refetchInterval: blockTimeMs,
      ...options,
    },
  );
};

export default useGetProposalState;
