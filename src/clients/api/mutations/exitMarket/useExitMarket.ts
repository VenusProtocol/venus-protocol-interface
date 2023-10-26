import BigNumber from 'bignumber.js';
import { useAnalytics } from 'packages/analytics';
import { MutationObserverOptions, useMutation } from 'react-query';

import { ExitMarketInput, ExitMarketOutput, exitMarket, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';

const useExitMarket = (
  options?: MutationObserverOptions<ExitMarketOutput, Error, ExitMarketInput>,
) => {
  const { captureAnalyticEvent } = useAnalytics();

  const wrappedExitMarket: (
    input: ExitMarketInput & {
      // These properties will be used for analytic purposes only
      poolName: string;
      userSupplyBalanceTokens: BigNumber;
    },
  ) => Promise<ExitMarketOutput> = exitMarket;

  return useMutation(FunctionKey.EXIT_MARKET, wrappedExitMarket, {
    ...options,
    onSuccess: (...onSuccessParams) => {
      const { poolName, vToken, userSupplyBalanceTokens } = onSuccessParams[1];

      captureAnalyticEvent('Tokens decollateralized', {
        poolName,
        tokenSymbol: vToken.symbol,
        userSupplyBalanceTokens: userSupplyBalanceTokens.toNumber(),
      });

      queryClient.invalidateQueries(FunctionKey.GET_MAIN_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParams);
      }
    },
  });
};

export default useExitMarket;
