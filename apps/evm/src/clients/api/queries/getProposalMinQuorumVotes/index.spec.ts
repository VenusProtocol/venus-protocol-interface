import { BigNumber as BN } from 'ethers';
import type { GovernorBravoDelegate } from 'libs/contracts';

import BigNumber from 'bignumber.js';
import { getProposalMinQuorumVotes } from '.';

describe('getProposalMinQuorumVotes', () => {
  test('returns the minimum amount of for votes needed for a proposal to reach a quorum', async () => {
    const fakeQuorumVotes = BN.from(123456789);

    const fakeContract = {
      quorumVotes: async () => fakeQuorumVotes,
    } as unknown as GovernorBravoDelegate;

    const res = await getProposalMinQuorumVotes({ governorBravoDelegateContract: fakeContract });

    expect(res).toStrictEqual({
      proposalMinQuorumVotesMantissa: new BigNumber(fakeQuorumVotes.toString()),
    });
  });
});
