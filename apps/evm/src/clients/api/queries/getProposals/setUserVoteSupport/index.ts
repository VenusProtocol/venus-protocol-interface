import { areAddressesEqual } from 'utilities';
import type { GetProposalsOutput } from '..';

export const setUserVoteSupport = ({
  data,
  accountAddress,
}: {
  data: GetProposalsOutput;
  accountAddress?: string;
}): GetProposalsOutput => ({
  ...data,
  proposals: data.proposals.map(proposal => ({
    ...proposal,
    userVoteSupport: accountAddress
      ? [...proposal.forVotes, ...proposal.againstVotes, ...proposal.abstainVotes].find(vote =>
          areAddressesEqual(vote.address, accountAddress),
        )?.support
      : undefined,
  })),
});
