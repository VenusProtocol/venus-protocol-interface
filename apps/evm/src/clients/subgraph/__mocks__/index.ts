import proposalsResponse from '__mocks__/subgraph/proposals.json';

export * from '../queries/isolatedPools/getIsolatedPoolParticipantsCount';
export * from '../queries/governanceBsc/getProposals';
export * from '../utilities/formatToProposal';

export const getProposals = vi.fn(async () => proposalsResponse);
export const getIsolatedPoolParticipantsCount = vi.fn();
