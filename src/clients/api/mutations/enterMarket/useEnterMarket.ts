import BigNumber from 'bignumber.js';
import { MutationObserverOptions, useMutation } from 'react-query';

import { EnterMarketInput, EnterMarketOutput, enterMarket, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAnalytics } from 'context/Analytics';

const useEnterMarket = (
  options?: MutationObserverOptions<EnterMarketOutput, Error, EnterMarketInput>,
) => {
  const { captureAnalyticEvent } = useAnalytics();

  const wrappedEnterMarket: (
    input: EnterMarketInput & {
      // These properties will be used for analytic purposes only
      poolName: string;
      userSupplyBalanceTokens: BigNumber;
    },
  ) => Promise<EnterMarketOutput> = enterMarket;

  return useMutation(FunctionKey.ENTER_MARKET, wrappedEnterMarket, {
    ...options,
    onSuccess: (...onSuccessParams) => {
      const { poolName, vToken, userSupplyBalanceTokens } = onSuccessParams[1];

      captureAnalyticEvent('Tokens collateralized', {
        poolName,
        tokenSymbol: vToken.symbol,
        userSupplyBalanceTokens: userSupplyBalanceTokens.toNumber(),
      });

      queryClient.invalidateQueries(FunctionKey.GET_MAIN_ASSETS_IN_ACCOUNT);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParams);
      }
    },
  });
};

export default useEnterMarket;
