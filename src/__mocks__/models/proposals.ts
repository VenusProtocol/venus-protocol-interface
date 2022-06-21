import { IProposalsApiResponse } from 'clients/api/queries/getProposals';
import formatToProposal from 'clients/api/queries/getProposals/formatToProposal';
import proposalResponse from '../api/proposals.json';

const proposals = proposalResponse.result.map(p =>
  formatToProposal(p as IProposalsApiResponse['result'][number]),
);

export default proposals;
