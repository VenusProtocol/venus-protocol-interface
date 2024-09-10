import fakeAccountAddress from '__mocks__/models/address';
import bscProposalsResponse from '__mocks__/subgraph/bscProposals.json';
import nonBscProposalsResponse from '__mocks__/subgraph/nonBscProposals.json';
import BigNumber from 'bignumber.js';
import type { ProposalsQuery } from 'clients/subgraph/gql/generated/governanceBsc';
import { formatToProposal } from '..';

describe('formatToProposal', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1710401645000));
  });

  it('returns proposal in the correct format', async () => {
    const res = formatToProposal({
      gqlProposal: bscProposalsResponse.proposals[0] as ProposalsQuery['proposals'][number],
      gqlRemoteProposalsMapping: nonBscProposalsResponse.proposals,
      currentBlockNumber: 41360384,
      proposalMinQuorumVotesMantissa: new BigNumber('1000000000000000000000'),
      accountAddress: fakeAccountAddress,
    });

    expect(res).toMatchSnapshot();
  });
});
