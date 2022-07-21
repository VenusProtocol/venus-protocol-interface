import { QueryObserverOptions, useQuery } from 'react-query';

import { useVenusLensContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

import getXvsReward, { GetXvsRewardInput, GetXvsRewardOutput } from '.';

type Options = QueryObserverOptions<
  GetXvsRewardOutput,
  Error,
  GetXvsRewardOutput,
  GetXvsRewardOutput,
  [FunctionKey.GET_XVS_REWARD, string]
>;

const useGetXvsReward = (
  { accountAddress }: Omit<GetXvsRewardInput, 'lensContract'>,
  options?: Options,
) => {
  const lensContract = useVenusLensContract();

  return useQuery(
    [FunctionKey.GET_XVS_REWARD, accountAddress],
    () =>
      getXvsReward({
        lensContract,
        accountAddress,
      }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetXvsReward;
