import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import {
  type GetProportionalCloseTolerancePercentageOutput,
  getProportionalCloseTolerancePercentage,
} from '.';

export type UseGetProportionalCloseTolerancePercentageQueryKey = [
  FunctionKey.GET_PROPORTIONAL_CLOSE_TOLERANCE_PERCENTAGE,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetProportionalCloseTolerancePercentageOutput | undefined,
  Error,
  GetProportionalCloseTolerancePercentageOutput | undefined,
  GetProportionalCloseTolerancePercentageOutput | undefined,
  UseGetProportionalCloseTolerancePercentageQueryKey
>;

export const useGetProportionalCloseTolerancePercentage = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  const { address: relativePositionManagerAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PROPORTIONAL_CLOSE_TOLERANCE_PERCENTAGE, { chainId }],
    queryFn: () =>
      callOrThrow({ relativePositionManagerAddress }, params =>
        getProportionalCloseTolerancePercentage({
          publicClient,
          ...params,
        }),
      ),
    ...options,
  });
};
