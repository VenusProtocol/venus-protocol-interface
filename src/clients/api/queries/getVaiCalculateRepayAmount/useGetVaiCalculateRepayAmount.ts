import { QueryObserverOptions, useQuery } from 'react-query';

import { getVaiCalculateRepayAmount } from 'clients/api';
import { useVaiControllerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

import { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

type Options = QueryObserverOptions<
  GetVaiCalculateRepayAmountOutput,
  Error,
  GetVaiCalculateRepayAmountOutput,
  GetVaiCalculateRepayAmountOutput,
  FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT
>;

const useGetVaiCalculateRepayAmount = (
  {
    accountAddress,
    repayAmountWei,
  }: Omit<GetVaiCalculateRepayAmountInput, 'vaiControllerContract'>,
  options?: Options,
) => {
  const vaiControllerContract = useVaiControllerContract();

  return useQuery(
    FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT,
    () => getVaiCalculateRepayAmount({ vaiControllerContract, accountAddress, repayAmountWei }),
    options,
  );
};

export default useGetVaiCalculateRepayAmount;
