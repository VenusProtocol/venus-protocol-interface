import { useAnalytics } from 'packages/analytics';
import { useGetGovernorBravoDelegateContract } from 'packages/contracts';
import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';

import castVote, { CastVoteInput, CastVoteOutput } from './castVote';

type TrimmedCastVoteInput = Omit<CastVoteInput, 'governorBravoDelegateContract'>;
type Options = MutationObserverOptions<CastVoteOutput, Error, TrimmedCastVoteInput>;

const useCastVote = (options?: Options) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useMutation(
    FunctionKey.CAST_VOTE,
    (input: TrimmedCastVoteInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        castVote({
          ...input,
          ...params,
        }),
      ),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { proposalId, voteType } = onSuccessParams[1];

        captureAnalyticEvent('Vote cast', {
          proposalId,
          voteType: indexedVotingSupportNames[voteType],
        });

        // Invalidate query to fetch voters
        queryClient.invalidateQueries([
          FunctionKey.GET_VOTERS,
          {
            id: proposalId,
            filter: voteType,
          },
        ]);

        // Invalidate query to fetch proposal list
        queryClient.invalidateQueries(FunctionKey.GET_PROPOSALS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useCastVote;
