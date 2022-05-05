import { useMutation, MutationObserverOptions } from 'react-query';

import { withdrawXvs, IWithdrawXvsInput, WithdrawXvsOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useXvsVestingProxyContract } from 'clients/contracts/hooks';

const useWithdrawXvs = (
  options?: MutationObserverOptions<
    WithdrawXvsOutput,
    Error,
    Omit<IWithdrawXvsInput, 'xvsVestingContract'>
  >,
) => {
  const xvsVestingContract = useXvsVestingProxyContract();
  return useMutation(
    FunctionKey.WITHDRAW_XVS,
    params =>
      withdrawXvs({
        xvsVestingContract,
        ...params,
      }),
    {
      ...options,
    },
  );
};

export default useWithdrawXvs;
