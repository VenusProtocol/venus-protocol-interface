import { Proposal_Type } from 'clients/subgraph';
import { ProposalType } from 'types';

export interface GetProposalTypeInput {
  type: Proposal_Type;
}

export const getProposalType = ({ type }: GetProposalTypeInput) => {
  if (type === Proposal_Type.Critical) {
    return ProposalType.CRITICAL;
  }

  if (type === Proposal_Type.FastTrack) {
    return ProposalType.FAST_TRACK;
  }

  return ProposalType.NORMAL;
};
