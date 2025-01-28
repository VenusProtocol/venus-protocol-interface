import { useGetCurrentVotes, useGetProposalThreshold } from 'clients/api';
import { ProposalState } from 'types';
import { areAddressesEqual } from 'utilities';
import type { Address } from 'viem';

export type UseIsProposalCancelableByUserProps = {
  state: ProposalState;
  proposerAddress: Address;
  accountAddress?: Address;
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
