import { request } from 'graphql-request';

import {
  ProposalDocument,
  type ProposalQueryVariables,
} from 'clients/subgraph/gql/generated/governanceBsc';
import config from 'config';
import type { ChainId } from 'types';

export interface GetBscProposalInput {
  chainId: ChainId;
  variables: ProposalQueryVariables;
}

export const getBscProposal = ({ chainId, variables }: GetBscProposalInput) =>
  config.subgraphUrls[chainId]?.governance
    ? request({
        url: config.subgraphUrls[chainId]!.governance!,
        variables,
        document: ProposalDocument,
      })
    : undefined;
