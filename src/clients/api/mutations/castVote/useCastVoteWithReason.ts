import { useMutation, MutationObserverOptions } from 'react-query';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import castVoteWithReason, {
  HookParams,
  ICastVoteWithReasonInput,
  CastVoteWithReasonOutput,
} from './castVoteWithReason';

export type CastVoteWithReasonParams = ICastVoteWithReasonInput;

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
    options,
  );
};

export default useCastVoteWithReason;
