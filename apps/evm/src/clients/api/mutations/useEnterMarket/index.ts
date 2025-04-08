import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { isolatedPoolComptrollerAbi } from 'libs/contracts';
import type { VToken } from 'types';
import type { Address } from 'viem';

type EnterMarketInput = {
  vToken: VToken;
  comptrollerContractAddress: Address;
  userSupplyBalanceTokens: BigNumber;
  poolName: string;
};
type Options = UseSendTransactionOptions<EnterMarketInput>;

export const useEnterMarket = (options?: Partial<Options>) => {
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: (input: EnterMarketInput) => ({
      abi: isolatedPoolComptrollerAbi,
      address: input.comptrollerContractAddress,
      functionName: 'enterMarkets',
      args: [[input.vToken.address]],
    }),
    onConfirmed: ({ input }) => {
      const { poolName, vToken, userSupplyBalanceTokens } = input;

      captureAnalyticEvent('Tokens collateralized', {
        poolName,
        tokenSymbol: vToken.symbol,
        userSupplyBalanceTokens: Number(userSupplyBalanceTokens.toFixed()),
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });
    },
    options,
  });
};
