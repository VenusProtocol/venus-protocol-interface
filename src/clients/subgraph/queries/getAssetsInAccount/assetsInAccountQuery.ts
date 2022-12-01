import { useQuery } from 'react-query';

import FunctionKey from 'constants/functionKey';

import subgraphClient from '../../subgraphClient';

const useGetAssetsInAccountSubgraph = (accountAddress: string) =>
  useQuery([FunctionKey.GET_ASSETS_IN_ACCOUNT, { accountAddress }], () =>
    subgraphClient.AssetsInAccountQuery({ accountAddress }),
  );

export default useGetAssetsInAccountSubgraph;
