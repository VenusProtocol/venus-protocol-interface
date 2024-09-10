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
  config.subgraphUrls[chainId]?.governance
    ? request({
        url: config.subgraphUrls[chainId]!.governance!,
        variables,
        document: ProposalsDocument,
      })
    : undefined;
