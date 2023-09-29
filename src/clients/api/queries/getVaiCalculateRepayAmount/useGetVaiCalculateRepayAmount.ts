import { useGetVaiControllerContract } from 'packages/contractsNew';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { getVaiCalculateRepayAmount } from 'clients/api';
import FunctionKey from 'constants/functionKey';

import { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

type Options = QueryObserverOptions<
  GetVaiCalculateRepayAmountOutput | undefined,
  Error,
  GetVaiCalculateRepayAmountOutput | undefined,
  GetVaiCalculateRepayAmountOutput | undefined,
  [
    FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT,
    {
      accountAddress: string;
      repayAmountWei: string;
    },
  ]
>;

const useGetVaiCalculateRepayAmount = (
  {
    accountAddress,
    repayAmountWei,
  }: Omit<GetVaiCalculateRepayAmountInput, 'vaiControllerContract'>,
  options?: Options,
) => {
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery(
    [
      FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT,
      {
        accountAddress,
        repayAmountWei: repayAmountWei.toFixed(),
      },
    ],
    () =>
      callOrThrow({ vaiControllerContract }, params =>
        getVaiCalculateRepayAmount({
          accountAddress,
          repayAmountWei,
          ...params,
        }),
      ),
    options,
  );
};

export default useGetVaiCalculateRepayAmount;
