import { MutationObserverOptions, useMutation } from 'react-query';

import { queryClient, repayVai, IRepayVaiInput, IRepayVaiOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitrollerContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  IRepayVaiOutput,
  Error,
  Omit<IRepayVaiInput, 'vaiControllerContract'>
>;

const useRepayVai = (options?: Options) => {
  const vaiControllerContract = useVaiUnitrollerContract();

  return useMutation(
    FunctionKey.REPAY_VAI,
    (params: Omit<IRepayVaiInput, 'vaiControllerContract'>) =>
      repayVai({
        vaiControllerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Invalidate queries related to fetching the user minted VAI amount
        queryClient.invalidateQueries(FunctionKey.GET_VENUS_VAI_STATE);
        queryClient.invalidateQueries(FunctionKey.GET_MINTED_VAI);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRepayVai;
