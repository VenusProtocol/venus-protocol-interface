import { MutationObserverOptions, useMutation } from 'react-query';

import { IRepayVaiOutput, RepayVaiInput, queryClient, repayVai } from 'clients/api';
import { useVaiControllerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  IRepayVaiOutput,
  Error,
  Omit<RepayVaiInput, 'vaiControllerContract'>
>;

const useRepayVai = (options?: Options) => {
  const vaiControllerContract = useVaiControllerContract();

  return useMutation(
    FunctionKey.REPAY_VAI,
    (params: Omit<RepayVaiInput, 'vaiControllerContract'>) =>
      repayVai({
        vaiControllerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Invalidate queries related to fetching the user minted VAI amount
        queryClient.invalidateQueries(FunctionKey.GET_MINTED_VAI);
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRepayVai;
