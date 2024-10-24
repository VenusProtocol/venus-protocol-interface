import { getNonBscProposals } from 'clients/subgraph';
import type { RemoteProposal } from 'clients/subgraph/gql/generated/governanceBsc';
import type { NonBscProposalFragment } from 'clients/subgraph/gql/generated/governanceNonBsc';
import { CHAIN_IDS_ON_LAYER_ZERO } from 'constants/layerZero';
import type { ChainId } from 'types';
import { extractSettledPromiseValue } from 'utilities';

export const enrichRemoteProposals = async ({
  gqlRemoteProposals,
}: {
  gqlRemoteProposals: (Pick<RemoteProposal, 'proposalId'> & {
    trustedRemote: Pick<RemoteProposal['trustedRemote'], 'layerZeroChainId'>;
  })[];
}) => {
  // Group proposals by chain ID
  const remoteProposalIdsMapping: {
    [chainId in ChainId]?: number[];
  } = {};

  gqlRemoteProposals.forEach(remoteProposal => {
    // Map LayerZero chain ID to actual chain ID
    const remoteChainId = CHAIN_IDS_ON_LAYER_ZERO[remoteProposal.trustedRemote.layerZeroChainId];

    if (remoteProposal.proposalId) {
      remoteProposalIdsMapping[remoteChainId] = [
        ...(remoteProposalIdsMapping[remoteChainId] || []),
        remoteProposal.proposalId,
      ];
    }
  });

  const results = await Promise.allSettled(
    Object.entries(remoteProposalIdsMapping).map(([chainId, remoteProposalIds]) =>
      getNonBscProposals({
        chainId: Number(chainId) as ChainId,
        variables: {
          where: {
            proposalId_in: remoteProposalIds.map(String),
          },
        },
      }),
    ),
  );

  const enrichedProposals = results.flatMap(extractSettledPromiseValue);

  const enrichedProposalsMapping: {
    [proposalId: number]: NonBscProposalFragment;
  } = {};

  enrichedProposals.forEach(p => {
    p?.proposals?.forEach(proposal => {
      enrichedProposalsMapping[proposal.proposalId] = proposal;
    });
  });

  return enrichedProposalsMapping;
};
