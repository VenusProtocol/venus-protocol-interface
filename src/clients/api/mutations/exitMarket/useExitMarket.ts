import { MutationObserverOptions, useMutation } from 'react-query';

import { ExitMarketInput, ExitMarketOutput, exitMarket, queryClient } from 'clients/api';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useExitMarket = (
  // @TODO: use custom error type (see https://app.clickup.com/t/2rvwhnt)
  options?: MutationObserverOptions<
    ExitMarketOutput,
    Error,
    Omit<ExitMarketInput, 'comptrollerContract'>
  >,
) => {
  const comptrollerContract = useComptrollerContract();

  // @TODO: invalidate related queries on success
  return useMutation(
    FunctionKey.EXIT_MARKET,
    (params: Omit<ExitMarketInput, 'comptrollerContract'>) =>
      exitMarket({
        comptrollerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useExitMarket;
