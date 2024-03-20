import { type ProposalPreviewsQuery, formatToProposalPreview } from 'clients/subgraph';

import proposalPreviewsResponse from '../subgraph/proposalPreviews.json';

const currentBlockNumber = 38563073;
const blockTimeMs = 3000;

export const proposalPreviews = proposalPreviewsResponse.proposals.map(gqlProposal =>
  formatToProposalPreview({
    gqlProposal: gqlProposal as ProposalPreviewsQuery['proposals'][number],
    currentBlockNumber,
    blockTimeMs,
  }),
);
