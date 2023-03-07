import { MutationObserverOptions, useMutation } from 'react-query';

import { ExitMarketInput, ExitMarketOutput, exitMarket, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';

const useExitMarket = (
  options?: MutationObserverOptions<ExitMarketOutput, Error, ExitMarketInput>,
) =>
  useMutation(FunctionKey.EXIT_MARKET, exitMarket, {
    ...options,
    onSuccess: (...onSuccessParams) => {
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_ASSETS_IN_ACCOUNT);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParams);
      }
    },
  });

export default useExitMarket;
