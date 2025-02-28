import bscProposalsResponse from '__mocks__/subgraph/bscProposals.json';
import nonBscProposalsResponse from '__mocks__/subgraph/nonBscProposals.json';

export * from '../queries/bscCorePool/getBscCorePoolParticipantsCount';
export * from '../queries/isolatedPools/getIsolatedPoolParticipantsCount';
export * from '../queries/governanceBsc/getBscProposals';
export * from '../utilities/formatToProposal';
export * from '../utilities/enrichRemoteProposals';

export const getBscProposals = vi.fn(async () => bscProposalsResponse);
export const getBscProposal = vi.fn(async () => ({
  proposal: bscProposalsResponse.proposals[0],
}));

export const getNonBscProposals = vi.fn(async () => nonBscProposalsResponse);

export const getBscCorePoolParticipantsCount = vi.fn();

export const getIsolatedPoolParticipantsCount = vi.fn();
