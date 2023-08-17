import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';
import { useAnalytics } from 'context/Analytics';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

import castVoteWithReason, {
  CastVoteWithReasonInput,
  CastVoteWithReasonOutput,
} from './castVoteWithReason';

type Options = MutationObserverOptions<CastVoteWithReasonOutput, Error, CastVoteWithReasonInput>;

const useCastVoteWithReason = (options?: Options) => {
  const governorBravoDelegateContract = useGetUniqueContract({
    name: 'governorBravoDelegate',
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useMutation(
    FunctionKey.CAST_VOTE,
    (input: CastVoteWithReasonInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        castVoteWithReason({
          ...input,
          ...params,
        }),
      ),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { proposalId, voteType } = onSuccessParams[1];

        captureAnalyticEvent('Vote casted', {
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

export default useCastVoteWithReason;
