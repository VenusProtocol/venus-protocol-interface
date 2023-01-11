import { useQuery } from 'react-query';

import FunctionKey from 'constants/functionKey';

import { getIsolatedPools } from '.';

// TODO: mock in tests

export const useGetIsolatedPools = () =>
  useQuery([FunctionKey.GET_SUBGRAPH_ISOLATED_POOLS], getIsolatedPools);
