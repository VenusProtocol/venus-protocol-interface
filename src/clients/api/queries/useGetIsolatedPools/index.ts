import { Pool } from 'types';

import { useGetIsolatedPools as useGetSubgraphIsolatedPools } from 'clients/subgraph';

export interface Data {
  pools: Pool[];
}

export interface UseGetIsolatedPoolsOutput {
  isLoading: boolean;
  data?: Data;
}

const useGetIsolatedPools = (): UseGetIsolatedPoolsOutput => {
  const { data: getGetSubgraphIsolatedPoolsData, isLoading: isGetSubgraphIsolatedPoolsLoading } =
    useGetSubgraphIsolatedPools();

  console.log(getGetSubgraphIsolatedPoolsData);

  return {
    data: {
      pools: [],
    },
    isLoading: isGetSubgraphIsolatedPoolsLoading,
  };
};

export default useGetIsolatedPools;
