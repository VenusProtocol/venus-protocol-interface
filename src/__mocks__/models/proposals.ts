import { formatToProposal } from 'utilities';

import { IProposalsApiResponse } from 'clients/api/queries/getProposals';

import proposalResponse from '../api/proposals.json';

const proposals = proposalResponse.result.map(p =>
  formatToProposal(p as IProposalsApiResponse['result'][number]),
);

export default proposals;
