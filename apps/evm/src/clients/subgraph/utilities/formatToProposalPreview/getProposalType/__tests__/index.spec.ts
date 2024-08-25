import { Proposal_Type } from 'clients/subgraph';
import { ProposalType } from 'types';
import { type GetProposalTypeInput, getProposalType } from '..';

describe('getProposalState', () => {
  const tests: { params: GetProposalTypeInput; expectedProposalType: ProposalType }[] = [
    {
      params: {
        type: Proposal_Type.Normal,
      },
      expectedProposalType: ProposalType.NORMAL,
    },
    {
      params: {
        type: Proposal_Type.FastTrack,
      },
      expectedProposalType: ProposalType.FAST_TRACK,
    },
    {
      params: {
        type: Proposal_Type.Critical,
      },
      expectedProposalType: ProposalType.CRITICAL,
    },
  ];

  it.each(tests)(
    'returns the right proposal type based on passed params: %s',
    async ({ params, expectedProposalType }) =>
      expect(getProposalType(params)).toBe(expectedProposalType),
  );
});
