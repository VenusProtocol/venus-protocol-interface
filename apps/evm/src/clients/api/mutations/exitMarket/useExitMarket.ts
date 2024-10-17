import type BigNumber from 'bignumber.js';

import { type ExitMarketInput, exitMarket, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';

type EnrichedExitMarketInput = ExitMarketInput & {
  // These properties will be used for analytic purposes only
  poolName: string;
  userSupplyBalanceTokens: BigNumber;
};
type Options = UseSendTransactionOptions<EnrichedExitMarketInput>;

const useExitMarket = (options?: Partial<Options>) => {
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: [FunctionKey.EXIT_MARKET],
    fn: exitMarket,
    onConfirmed: ({ input }) => {
      const { poolName, vToken, userSupplyBalanceTokens } = input;

      captureAnalyticEvent('Tokens decollateralized', {
        poolName,
        tokenSymbol: vToken.symbol,
        userSupplyBalanceTokens: userSupplyBalanceTokens.toNumber(),
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_LEGACY_POOL],
      });
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_ISOLATED_POOLS],
      });
    },
    options,
  });
};

export default useExitMarket;
