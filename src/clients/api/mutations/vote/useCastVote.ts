import { MutationObserverOptions, useMutation } from 'react-query';

import { queryClient } from 'clients/api';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

import castVote, { CastVoteInput, CastVoteOutput } from './castVote';

export type CastVoteParams = Omit<CastVoteInput, 'governorBravoContract' | 'fromAccountAddress'>;

const useCastVote = (
  { fromAccountAddress }: { fromAccountAddress: string },
  options?: MutationObserverOptions<CastVoteOutput, Error, CastVoteParams>,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();
  return useMutation(
    FunctionKey.CAST_VOTE,
    params =>
      castVote({
        governorBravoContract,
        fromAccountAddress,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { proposalId, voteType } = onSuccessParams[1];

        // Invalidate query to fetch voters
        queryClient.invalidateQueries([
          FunctionKey.GET_VOTERS,
          {
            id: proposalId,
            filter: voteType,
          },
        ]);

        // Invalidate query to fetch proposal list
        queryClient.invalidateQueries([FunctionKey.GET_PROPOSALS]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useCastVote;
