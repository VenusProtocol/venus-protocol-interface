import { formatToProposal } from 'utilities';

import { ProposalsApiResponse } from 'clients/api/queries/getProposals';

import proposalResponse from '../api/proposals.json';

const proposals = proposalResponse.result.map(p =>
  formatToProposal(p as ProposalsApiResponse['result'][number]),
);

export default proposals;
