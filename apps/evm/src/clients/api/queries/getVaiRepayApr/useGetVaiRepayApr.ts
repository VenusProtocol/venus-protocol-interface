import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getVaiRepayApr, { type GetVaiRepayAprOutput } from 'clients/api/queries/getVaiRepayApr';
import FunctionKey from 'constants/functionKey';
import { useGetVaiControllerContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

export type UseGetVaiRepayAprQueryKey = [FunctionKey.GET_VAI_REPAY_APR, { chainId: ChainId }];

type Options = QueryObserverOptions<
  GetVaiRepayAprOutput | undefined,
  Error,
  GetVaiRepayAprOutput | undefined,
  GetVaiRepayAprOutput | undefined,
  UseGetVaiRepayAprQueryKey
>;

const useGetVaiRepayApr = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery({
    queryKey: [FunctionKey.GET_VAI_REPAY_APR, { chainId }],
    queryFn: () => callOrThrow({ vaiControllerContract }, getVaiRepayApr),
    ...options,
  });
};

export default useGetVaiRepayApr;
