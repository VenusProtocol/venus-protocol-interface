import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { getVaiCalculateRepayAmount } from 'clients/api';
import { useGetUniqueContractAddress } from 'clients/contracts';
import { useMulticall } from 'clients/web3';
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
  }: Omit<GetVaiCalculateRepayAmountInput, 'multicall' | 'vaiControllerContractAddress'>,
  options?: Options,
) => {
  const multicall = useMulticall();
  const vaiControllerContractAddress = useGetUniqueContractAddress({
    name: 'vaiController',
  });

  return useQuery(
    [
      FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT,
      {
        accountAddress,
        repayAmountWei: repayAmountWei.toFixed(),
      },
    ],
    () =>
      callOrThrow({ vaiControllerContractAddress }, params =>
        getVaiCalculateRepayAmount({
          multicall,
          accountAddress,
          repayAmountWei,
          ...params,
        }),
      ),
    options,
  );
};

export default useGetVaiCalculateRepayAmount;
