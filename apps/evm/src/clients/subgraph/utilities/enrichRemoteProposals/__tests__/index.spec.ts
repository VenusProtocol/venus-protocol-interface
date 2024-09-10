import bscProposalsResponse from '__mocks__/subgraph/bscProposals.json';
import { enrichRemoteProposals } from '..';

describe('enrichRemoteProposals', () => {
  it('returns remote proposals in the correct format', async () => {
    const res = await enrichRemoteProposals({
      gqlRemoteProposals: bscProposalsResponse.proposals[0].remoteProposals,
    });

    expect(res).toMatchSnapshot();
  });
});
