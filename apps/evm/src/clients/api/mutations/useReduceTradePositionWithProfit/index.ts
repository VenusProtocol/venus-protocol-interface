import type { Address } from 'viem';

import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { relativePositionManagerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ApproximateOutSwapQuote, ExactInSwapQuote } from 'types';
import { convertPercentageToBps } from 'utilities';

export type ReduceTradePositionWithProfitInput = {
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  closeFractionPercentage: number;
  repaySwapQuote: ApproximateOutSwapQuote;
  profitSwapQuote: ExactInSwapQuote;
};

type Options = UseSendTransactionOptions<ReduceTradePositionWithProfitInput>;

export const useReduceTradePositionWithProfit = (options?: Partial<Options>) => {
  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  return useSendTransaction({
    fn: ({
      longVTokenAddress,
      shortVTokenAddress,
      closeFractionPercentage,
      repaySwapQuote,
      profitSwapQuote,
    }: ReduceTradePositionWithProfitInput) => {
      if (!relativePositionManagerContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const closeFractionBps = convertPercentageToBps({
        percentage: closeFractionPercentage,
      });

      return {
        abi: relativePositionManagerAbi,
        address: relativePositionManagerContractAddress,
        functionName: 'closeWithProfit',
        args: [
          longVTokenAddress,
          shortVTokenAddress,
          closeFractionBps,
          repaySwapQuote.fromTokenAmountSoldMantissa,
          repaySwapQuote.minimumToTokenAmountReceivedMantissa,
          repaySwapQuote.callData,
          profitSwapQuote.fromTokenAmountSoldMantissa,
          profitSwapQuote.minimumToTokenAmountReceivedMantissa,
          profitSwapQuote.callData,
        ],
      } as const;
    },
    onConfirmed: () => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_RAW_TRADE_POSITIONS],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_ACCOUNT_TRANSACTION_HISTORY],
      });
    },
    options,
  });
};
