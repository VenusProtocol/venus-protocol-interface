import { type ProposalPreviewsQuery, formatToProposalPreview } from 'clients/subgraph';

import BigNumber from 'bignumber.js';
import proposalPreviewsResponse from '../subgraph/proposalPreviews.json';

const currentBlockNumber = 38563073;
const blockTimeMs = 3000;
const proposalMinQuorumVotesMantissa = new BigNumber('600000000000000000000000');

export const proposalPreviews = proposalPreviewsResponse.proposals.map(gqlProposal =>
  formatToProposalPreview({
    gqlProposal: gqlProposal as ProposalPreviewsQuery['proposals'][number],
    proposalMinQuorumVotesMantissa,
    currentBlockNumber,
    blockTimeMs,
  }),
);
