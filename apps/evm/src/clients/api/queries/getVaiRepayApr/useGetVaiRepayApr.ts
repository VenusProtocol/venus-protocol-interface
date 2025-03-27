import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getVaiControllerContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { type GetVaiRepayAprOutput, getVaiRepayApr } from '.';

export type UseGetVaiRepayAprQueryKey = [FunctionKey.GET_VAI_REPAY_APR, { chainId: ChainId }];

type Options = QueryObserverOptions<
  GetVaiRepayAprOutput | undefined,
  Error,
  GetVaiRepayAprOutput | undefined,
  GetVaiRepayAprOutput | undefined,
  UseGetVaiRepayAprQueryKey
>;

export const useGetVaiRepayApr = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const vaiControllerAddress = getVaiControllerContractAddress({
    chainId,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_VAI_REPAY_APR, { chainId }],
    queryFn: () =>
      callOrThrow({ publicClient, vaiControllerAddress }, params => getVaiRepayApr({ ...params })),
    ...options,
  });
};
