import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { usePublicClient } from 'libs/wallet';
import { type GetBurnedWBnbOutput, getBurnedWBnb } from '.';

export type UseGetBurnedWBnbQueryKey = [FunctionKey.GET_BURNED_BNB];

type Options = QueryObserverOptions<
  GetBurnedWBnbOutput,
  Error,
  GetBurnedWBnbOutput,
  GetBurnedWBnbOutput,
  UseGetBurnedWBnbQueryKey
>;

export const useGetBurnedWBnb = (options?: Partial<Options>) => {
  const { publicClient } = usePublicClient();
  const isBurnedWBnbButtonFeatureEnabled = useIsFeatureEnabled({ name: 'burnedWBnbButton' });

  return useQuery({
    queryKey: [FunctionKey.GET_BURNED_BNB],
    queryFn: () => getBurnedWBnb({ publicClient }),
    ...options,
    enabled:
      (options?.enabled === undefined || options?.enabled) && isBurnedWBnbButtonFeatureEnabled,
  });
};
