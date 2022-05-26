import { useQuery, QueryObserverOptions } from 'react-query';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import getXvsReward, { GetXvsRewardOutput } from './getXvsReward';

type Options = QueryObserverOptions<
  GetXvsRewardOutput,
  Error,
  GetXvsRewardOutput,
  GetXvsRewardOutput,
  FunctionKey.GET_XVS_REWARD
>;

const useGetXvsReward = (accountAddress: string | undefined, options?: Options) => {
  const lensContract = useVenusLensContract();

  return useQuery(
    FunctionKey.GET_XVS_REWARD,
    () =>
      getXvsReward({
        lensContract,
        accountAddress: accountAddress || '',
      }),
    {
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        // Check user have connected their wallet
        accountAddress !== undefined,
    },
  );
};

export default useGetXvsReward;
