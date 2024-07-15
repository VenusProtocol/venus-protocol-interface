import type BigNumber from 'bignumber.js';

import {
  type EnterMarketInput,
  type EnterMarketOutput,
  enterMarket,
  queryClient,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';

type EnrichedEnterMarketInput = EnterMarketInput & {
  // These properties will be used for analytic purposes only
  poolName: string;
  userSupplyBalanceTokens: BigNumber;
};

type Options = UseSendTransactionOptions<EnrichedEnterMarketInput>;

const useEnterMarket = (options?: Partial<Options>) => {
  const { captureAnalyticEvent } = useAnalytics();

  const wrappedEnterMarket: (input: EnrichedEnterMarketInput) => Promise<EnterMarketOutput> =
    enterMarket;

  return useSendTransaction({
    fnKey: [FunctionKey.ENTER_MARKET],
    fn: wrappedEnterMarket,
    onConfirmed: ({ input }) => {
      const { poolName, vToken, userSupplyBalanceTokens } = input;

      captureAnalyticEvent('Tokens collateralized', {
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

export default useEnterMarket;
