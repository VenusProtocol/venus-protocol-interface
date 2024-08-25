import proposalsResponse from '__mocks__/subgraph/proposals.json';

export * from '../queries/isolatedPools/getIsolatedPoolParticipantsCount';
export * from '../queries/governanceBsc/getBscProposals';
export * from '../utilities/formatToProposal';

export const getBscProposals = vi.fn(async () => proposalsResponse);
export const getBscProposal = vi.fn(async () => ({
  proposal: proposalsResponse.proposals[0],
}));
export const getIsolatedPoolParticipantsCount = vi.fn();
