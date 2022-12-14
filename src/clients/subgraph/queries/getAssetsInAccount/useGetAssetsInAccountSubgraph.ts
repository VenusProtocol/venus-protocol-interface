import { useQuery } from 'react-query';

import { getAssetsInAccount } from 'clients/subgraph';
import FunctionKey from 'constants/functionKey';

const useGetAssetsInAccountSubgraph = (accountAddress: string) =>
  useQuery([FunctionKey.GET_ASSETS_IN_ACCOUNT, { accountAddress }], () =>
    getAssetsInAccount(accountAddress),
  );

export default useGetAssetsInAccountSubgraph;
