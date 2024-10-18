import { request } from 'graphql-request';

import {
  ProposalsDocument,
  type ProposalsQueryVariables,
} from 'clients/subgraph/gql/generated/governanceBsc';
import config from 'config';
import type { ChainId } from 'types';

export interface GetBscProposalsInput {
  chainId: ChainId;
  variables: ProposalsQueryVariables;
}

export const getBscProposals = ({ chainId, variables }: GetBscProposalsInput) =>
  config.governanceSubgraphUrls[chainId]
    ? request({
        url: config.governanceSubgraphUrls[chainId],
        variables,
        document: ProposalsDocument,
      })
    : undefined;
