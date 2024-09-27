import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import { getVaiCalculateRepayAmount } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetVaiControllerContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

import type { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

export type UseGetVaiCalculateRepayAmountQueryKey = [
  FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT,
  {
    accountAddress: string;
    repayAmountMantissa: string;
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetVaiCalculateRepayAmountOutput | undefined,
  Error,
  GetVaiCalculateRepayAmountOutput | undefined,
  GetVaiCalculateRepayAmountOutput | undefined,
  UseGetVaiCalculateRepayAmountQueryKey
>;

const useGetVaiCalculateRepayAmount = (
  {
    accountAddress,
    repayAmountMantissa,
  }: Omit<GetVaiCalculateRepayAmountInput, 'vaiControllerContract'>,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery({
    queryKey: [
      FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT,
      {
        accountAddress,
        chainId,
        repayAmountMantissa: repayAmountMantissa.toFixed(),
      },
    ],

    queryFn: () =>
      callOrThrow({ vaiControllerContract }, params =>
        getVaiCalculateRepayAmount({
          accountAddress,
          repayAmountMantissa,
          ...params,
        }),
      ),

    ...options,
  });
};

export default useGetVaiCalculateRepayAmount;
