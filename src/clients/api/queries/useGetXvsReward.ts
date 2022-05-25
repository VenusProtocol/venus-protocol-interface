import { useQuery, QueryObserverOptions } from 'react-query';
import { useVenusLensContract } from 'clients/contracts/hooks';
import useGetVenusInitialIndex from 'clients/api/queries/useGetVenusInitialIndex';
import useGetVenusAccrued from 'clients/api/queries/useGetVenusAccrued';
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

  const { data: venusInitialIndex } = useGetVenusInitialIndex();
  const { data: xvsAccrued } = useGetVenusAccrued(accountAddress || '', {
    enabled: !!accountAddress,
  });

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
        accountAddress !== undefined &&
        // Check all required queries executed successfully
        venusInitialIndex !== undefined &&
        xvsAccrued !== undefined,
    },
  );
};

export default useGetXvsReward;
