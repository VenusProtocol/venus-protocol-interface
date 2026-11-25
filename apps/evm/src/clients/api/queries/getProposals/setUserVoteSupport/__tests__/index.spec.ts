import { proposals } from '__mocks__/models/proposals';
import { VoteSupport } from 'types';

import { setUserVoteSupport } from '..';

const voterAddress = proposals[0].forVotes[0].address;

describe('setUserVoteSupport', () => {
  it("sets the connected wallet's vote, whatever the address case", () => {
    const result = setUserVoteSupport({
      data: { proposals: [proposals[0]], total: 1 },
      accountAddress: voterAddress.toUpperCase().replace('0X', '0x'),
    });

    expect(result.proposals[0].userVoteSupport).toBe(VoteSupport.For);
  });

  it('leaves the vote empty without a wallet or a vote', () => {
    expect(
      setUserVoteSupport({ data: { proposals: [proposals[0]], total: 1 } }).proposals[0]
        .userVoteSupport,
    ).toBeUndefined();

    expect(
      setUserVoteSupport({
        data: { proposals: [proposals[0]], total: 1 },
        accountAddress: '0x0000000000000000000000000000000000000001',
      }).proposals[0].userVoteSupport,
    ).toBeUndefined();
  });
});
