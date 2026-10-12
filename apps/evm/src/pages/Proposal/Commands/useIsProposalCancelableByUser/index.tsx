import { useGetCurrentVotes, useGetProposalThreshold } from 'clients/api';
import { ProposalState, type ProposalType } from 'types';
import { areAddressesEqual } from 'utilities';
import type { Address } from 'viem';

export type UseIsProposalCancelableByUserProps = {
  state: ProposalState;
  proposalType: ProposalType;
  proposerAddress: Address;
  accountAddress?: Address;
};

export const useIsProposalCancelableByUser = ({
  state,
  proposalType,
  proposerAddress,
  accountAddress,
}: UseIsProposalCancelableByUserProps) => {
  const hasCorrectState = state === ProposalState.Pending || state === ProposalState.Active;

  const { data: proposalThresholdData } = useGetProposalThreshold(
    { proposalType },
    { enabled: hasCorrectState },
  );
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
