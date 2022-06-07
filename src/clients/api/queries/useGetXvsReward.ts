import { useQuery, QueryObserverOptions } from 'react-query';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import getXvsReward, { GetXvsRewardOutput } from './getXvsReward';

type Options = QueryObserverOptions<
  GetXvsRewardOutput,
  Error,
  GetXvsRewardOutput,
  GetXvsRewardOutput,
  [FunctionKey.GET_XVS_REWARD, string]
>;

const useGetXvsReward = (accountAddress: string | undefined, options?: Options) => {
  const lensContract = useVenusLensContract();

  return useQuery(
    [FunctionKey.GET_XVS_REWARD, accountAddress],
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
