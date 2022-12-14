import { request } from 'graphql-request';
import { useQuery } from 'react-query';

import FunctionKey from 'constants/functionKey';
import { AssetsInAccountQueryDocument, subgraphEndpoint } from 'types/subgraph/gql/queries';

const useGetAssetsInAccountSubgraph = (accountAddress: string) =>
  useQuery([FunctionKey.GET_ASSETS_IN_ACCOUNT, { accountAddress }], () =>
    request(subgraphEndpoint, AssetsInAccountQueryDocument, { accountAddress }),
  );

export default useGetAssetsInAccountSubgraph;
