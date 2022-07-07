import { useQuery, QueryObserverOptions } from 'react-query';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { BLOCK_VALIDATION_RATE_IN_SECONDS } from 'constants/bsc';
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
      refetchInterval: BLOCK_VALIDATION_RATE_IN_SECONDS * 5 * 1000, // Refetch every 5 blocks
      ...options,
    },
  );
};

export default useGetXvsReward;
