import { QueryObserverOptions, useQuery } from 'react-query';

import { getVaiCalculateRepayAmount } from 'clients/api';
import { useMulticall } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

import { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

type Options = QueryObserverOptions<
  GetVaiCalculateRepayAmountOutput,
  Error,
  GetVaiCalculateRepayAmountOutput,
  GetVaiCalculateRepayAmountOutput,
  [
    FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT,
    {
      accountAddress: string;
      repayAmountWei: string;
    },
  ]
>;

const useGetVaiCalculateRepayAmount = (
  { accountAddress, repayAmountWei }: Omit<GetVaiCalculateRepayAmountInput, 'multicall'>,
  options?: Options,
) => {
  const multicall = useMulticall();

  return useQuery(
    [
      FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT,
      {
        accountAddress,
        repayAmountWei: repayAmountWei.toFixed(),
      },
    ],
    () => getVaiCalculateRepayAmount({ multicall, accountAddress, repayAmountWei }),
    options,
  );
};

export default useGetVaiCalculateRepayAmount;
