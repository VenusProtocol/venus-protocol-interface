import { IProposalApiResponse } from 'clients/api/queries/getProposals';
import formatToProposal from 'clients/api/queries/getProposals/formatToProposal';
import proposalResponse from '../api/proposals.json';

const proposals = proposalResponse.result.map(p =>
  formatToProposal(p as IProposalApiResponse['result'][number]),
);

export default proposals;
