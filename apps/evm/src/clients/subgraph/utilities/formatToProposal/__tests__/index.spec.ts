import fakeAccountAddress from '__mocks__/models/address';
import proposalsResponse from '__mocks__/subgraph/proposals.json';
import BigNumber from 'bignumber.js';
import type { ProposalsQuery } from 'clients/subgraph/gql/generated/governanceBsc';
import { formatToProposal } from '..';

describe('formatToProposal', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1710401645000));
  });

  it('returns proposal in the correct format', async () => {
    const res = formatToProposal({
      gqlProposal: proposalsResponse.proposals[0] as ProposalsQuery['proposals'][number],
      currentBlockNumber: 41360384,
      proposalMinQuorumVotesMantissa: new BigNumber('1000000000000000000000'),
      proposalExecutionGracePeriodMs: 1000,
      accountAddress: fakeAccountAddress,
      blockTimeMs: 3000,
    });

    expect(res).toMatchSnapshot();
  });
});
