import { useMutation, MutationObserverOptions } from 'react-query';

import { queryClient, exitMarket, IExitMarketInput, ExitMarketOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract } from 'clients/contracts/hooks';

const useExitMarket = (
  // @TODO: use custom error type (see https://app.clickup.com/t/2rvwhnt)
  options?: MutationObserverOptions<
    ExitMarketOutput,
    Error,
    Omit<IExitMarketInput, 'comptrollerContract'>
  >,
) => {
  const comptrollerContract = useComptrollerContract();

  // @TODO: invalidate related queries on success
  return useMutation(
    FunctionKey.EXIT_MARKET,
    (params: Omit<IExitMarketInput, 'comptrollerContract'>) =>
      exitMarket({
        comptrollerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (
        data: void,
        variables: Omit<IExitMarketInput, 'comptrollerContract'>,
        context: unknown,
      ) => {
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);
        if (options?.onSuccess) {
          options.onSuccess(data, variables, context);
        }
      },
    },
  );
};

export default useExitMarket;
