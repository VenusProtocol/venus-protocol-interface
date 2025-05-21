import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
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
  const { address: vaiControllerAddress } = useGetContractAddress({
    name: 'VaiController',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_VAI_REPAY_APR, { chainId }],
    queryFn: () =>
      callOrThrow({ vaiControllerAddress }, params => getVaiRepayApr({ ...params, publicClient })),
    ...options,
  });
};
