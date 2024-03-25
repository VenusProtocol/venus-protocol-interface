import proposalPreviewsResponse from '__mocks__/subgraph/proposalPreviews.json';
import type { ProposalPreviewsQuery } from 'clients/subgraph';
import { formatToProposalPreview } from '..';

describe('formatToProposalPreview', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1710401645000));
  });

  it('returns proposal preview in the correct format', async () => {
    const res = formatToProposalPreview({
      gqlProposal: proposalPreviewsResponse
        .proposals[0] as ProposalPreviewsQuery['proposals'][number],
      currentBlockNumber: 38563073,
      blockTimeMs: 3000,
    });

    expect(res).toMatchSnapshot();
  });
});
