import type { ChainId } from '@venusprotocol/chains';
import { GraphQLClient, gql } from 'graphql-request';
import type { Address } from 'viem';

import { MORPHO_SUBGRAPH_URL } from '../constants';

const morphoSubgraphClient = new GraphQLClient(MORPHO_SUBGRAPH_URL, { errorPolicy: 'ignore' });

const morphoPositionsDocument = gql`
  query UserPositions($accountAddress: String!, $chainId: Int!) {
    userByAddress(address: $accountAddress, chainId: $chainId) {
      vaultPositions {
        state {
          assets
          shares
        }

        vault {
          address

          asset {
            address
          }

          state {
            netApy
          }

          liquidity {
            underlying
          }
        }
      }
    }
  }
`;

interface MorphoSubgraphVault {
  vault: {
    address: Address;
    asset: {
      address: Address;
    };
    state: {
      netApy: number;
    };
    liquidity: {
      underlying: number;
    };
  };
  state?: {
    assets: number;
    shares: number;
  };
}

interface MorphoSubgraphUserPositionsResult {
  userByAddress: {
    vaultPositions: MorphoSubgraphVault[];
  };
}

export const getMorphoSubgraphUserPositions = async ({
  accountAddress,
  chainId,
}: { accountAddress: Address; chainId: ChainId }) =>
  morphoSubgraphClient.request<MorphoSubgraphUserPositionsResult>(morphoPositionsDocument, {
    accountAddress,
    chainId,
  });
