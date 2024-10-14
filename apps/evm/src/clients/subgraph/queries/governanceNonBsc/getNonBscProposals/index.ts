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
  config.governanceSubgraphUrls[chainId]
    ? request({
        url: config.governanceSubgraphUrls[chainId],
        variables,
        document: ProposalsDocument,
      })
    : undefined;
