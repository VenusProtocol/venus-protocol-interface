import { MutationObserverOptions, useMutation } from 'react-query';

import { queryClient } from 'clients/api';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

import castVoteWithReason, {
  CastVoteWithReasonInput,
  CastVoteWithReasonOutput,
  HookParams,
} from './castVoteWithReason';

export type CastVoteWithReasonParams = CastVoteWithReasonInput;

const useCastVoteWithReason = (
  { fromAccountAddress }: Pick<HookParams, 'fromAccountAddress'>,
  options?: MutationObserverOptions<CastVoteWithReasonOutput, Error, CastVoteWithReasonParams>,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();
  return useMutation(
    FunctionKey.CAST_VOTE,
    params =>
      castVoteWithReason({
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

export default useCastVoteWithReason;
