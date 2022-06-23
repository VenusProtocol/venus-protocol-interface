import { useMutation, MutationObserverOptions } from 'react-query';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import castVote, { ICastVoteInput, CastVoteOutput } from './castVote';

export type CastVoteParams = Omit<ICastVoteInput, 'governorBravoContract' | 'fromAccountAddress'>;

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
    options,
  );
};

export default useCastVote;
