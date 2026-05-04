import type { Address } from 'viem';

import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { relativePositionManagerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ApproximateOutSwapQuote, ExactInSwapQuote } from 'types';

export type CloseTradePositionWithLossInput = {
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  repaySwapQuote: ExactInSwapQuote;
  lossSwapQuote?: ApproximateOutSwapQuote;
};

type Options = UseSendTransactionOptions<CloseTradePositionWithLossInput>;

export const useCloseTradePositionWithLoss = (options?: Partial<Options>) => {
  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  return useSendTransaction({
    fn: ({
      longVTokenAddress,
      shortVTokenAddress,
      repaySwapQuote,
      lossSwapQuote,
    }: CloseTradePositionWithLossInput) => {
      if (!relativePositionManagerContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: relativePositionManagerAbi,
        address: relativePositionManagerContractAddress,
        functionName: 'closeWithLossAndDeactivate',
        args: [
          longVTokenAddress,
          shortVTokenAddress,
          {
            longAmountToRedeemForFirstSwap: repaySwapQuote.fromTokenAmountSoldMantissa,
            shortAmountToRepayForFirstSwap: repaySwapQuote.minimumToTokenAmountReceivedMantissa,
            minAmountOutFirst: repaySwapQuote.minimumToTokenAmountReceivedMantissa,
            swapDataFirst: repaySwapQuote.callData,
            dsaAmountToRedeemForSecondSwap: lossSwapQuote
              ? lossSwapQuote.fromTokenAmountSoldMantissa
              : 0n,
            minAmountOutSecond: lossSwapQuote
              ? lossSwapQuote.minimumToTokenAmountReceivedMantissa
              : 0n,
            swapDataSecond: lossSwapQuote ? lossSwapQuote.callData : '0x',
          },
        ],
      } as const;
    },
    onConfirmed: () => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });

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
