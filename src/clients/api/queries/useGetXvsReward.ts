import { useQuery, QueryObserverOptions } from 'react-query';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import getXvsReward, { IGetXvsRewardInput, GetXvsRewardOutput } from './getXvsReward';

type Options = QueryObserverOptions<
  GetXvsRewardOutput,
  Error,
  GetXvsRewardOutput,
  GetXvsRewardOutput,
  [FunctionKey.GET_XVS_REWARD, string]
>;

const useGetXvsReward = (
  { accountAddress }: Omit<IGetXvsRewardInput, 'lensContract'>,
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
