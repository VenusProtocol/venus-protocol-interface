import { useGetCurrentVotes, useGetProposalThreshold } from 'clients/api';
import { ProposalState } from 'types';
import { areAddressesEqual } from 'utilities';

export type UseIsProposalCancelableByUserProps = {
  state: ProposalState;
  proposerAddress: string;
  accountAddress?: string;
};

export const useIsProposalCancelableByUser = ({
  state,
  proposerAddress,
  accountAddress,
}: UseIsProposalCancelableByUserProps) => {
  const hasCorrectState = state === ProposalState.Pending || state === ProposalState.Active;

  const { data: proposalThresholdData } = useGetProposalThreshold({
    enabled: hasCorrectState,
  });
  const proposalThresholdMantissa = proposalThresholdData?.thresholdMantissa;

  const { data: proposerVotesData } = useGetCurrentVotes(
    { accountAddress: proposerAddress },
    { enabled: hasCorrectState },
  );
  const proposalVotesMantissa = proposerVotesData?.votesMantissa;

  const userIsProposer = areAddressesEqual(proposerAddress, accountAddress || '');
  const proposerHasEnoughVotingPower =
    !proposalThresholdMantissa ||
    !proposalVotesMantissa ||
    proposalVotesMantissa.isGreaterThanOrEqualTo(proposalThresholdMantissa);

  const isCancelable = hasCorrectState && (userIsProposer || !proposerHasEnoughVotingPower);

  return {
    isCancelable,
  };
};
