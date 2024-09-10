import { request } from 'graphql-request';

import {
  ProposalsDocument,
  type ProposalsQueryVariables,
} from 'clients/subgraph/gql/generated/governanceNonBsc';
import config from 'config';
import type { ChainId } from 'types';

export interface GetNonBscProposalsInput {
  chainId: ChainId;
  variables: ProposalsQueryVariables;
}

export const getNonBscProposals = ({ chainId, variables }: GetNonBscProposalsInput) =>
  config.subgraphUrls[chainId]?.governance
    ? request({
        url: config.subgraphUrls[chainId]!.governance!,
        variables,
        document: ProposalsDocument,
      })
    : undefined;
