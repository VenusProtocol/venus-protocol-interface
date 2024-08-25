import proposalPreviewsResponse from '__mocks__/subgraph/proposalPreviews.json';

export * from '../gql';
export * from '../queries/isolatedPools/getIsolatedPoolParticipantsCount';
export * from '../queries/governance/getProposalPreviews';
export * from '../utilities/formatToProposalPreview';

export const getProposalPreviews = vi.fn(async () => proposalPreviewsResponse);
export const getIsolatedPoolParticipantsCount = vi.fn();
