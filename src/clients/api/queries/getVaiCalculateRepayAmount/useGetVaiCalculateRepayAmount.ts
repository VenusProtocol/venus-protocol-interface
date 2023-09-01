import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { getVaiCalculateRepayAmount } from 'clients/api';
import { useMulticall3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

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
  }: Omit<GetVaiCalculateRepayAmountInput, 'multicall3' | 'vaiControllerContractAddress'>,
  options?: Options,
) => {
  const multicall3 = useMulticall3();
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
          multicall3,
          accountAddress,
          repayAmountWei,
          ...params,
        }),
      ),
    options,
  );
};

export default useGetVaiCalculateRepayAmount;
