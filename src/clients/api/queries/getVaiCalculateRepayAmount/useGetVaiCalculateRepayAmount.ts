import { useGetVaiControllerContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import { getVaiCalculateRepayAmount } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

import { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

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
  options?: Options,
) => {
  const { chainId } = useAuth();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery(
    [
      FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT,
      {
        accountAddress,
        chainId,
        repayAmountMantissa: repayAmountMantissa.toFixed(),
      },
    ],
    () =>
      callOrThrow({ vaiControllerContract }, params =>
        getVaiCalculateRepayAmount({
          accountAddress,
          repayAmountMantissa,
          ...params,
        }),
      ),
    options,
  );
};

export default useGetVaiCalculateRepayAmount;
