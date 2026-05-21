import type BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { relativePositionManagerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ApproximateOutSwapQuote, ExactInSwapQuote } from 'types';
import { convertPercentageToBps } from 'utilities';

export type ReduceTradePositionWithLossInput = {
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  closeFractionPercentage: number;
  repaySwapQuote: ExactInSwapQuote;
  lossSwapQuote?: ApproximateOutSwapQuote;
  repayShortAmountMantissa?: BigNumber;
};

type Options = UseSendTransactionOptions<ReduceTradePositionWithLossInput>;

export const useReduceTradePositionWithLoss = (options?: Partial<Options>) => {
  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  return useSendTransaction({
    fn: ({
      longVTokenAddress,
      shortVTokenAddress,
      closeFractionPercentage,
      repaySwapQuote,
      lossSwapQuote,
      repayShortAmountMantissa,
    }: ReduceTradePositionWithLossInput) => {
      if (!relativePositionManagerContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const closeFractionBps = convertPercentageToBps({
        percentage: closeFractionPercentage,
      });

      let minAmountOutSecond = lossSwapQuote?.minimumToTokenAmountReceivedMantissa;

      if (minAmountOutSecond === undefined) {
        minAmountOutSecond = repayShortAmountMantissa
          ? BigInt(repayShortAmountMantissa.toFixed())
          : 0n;
      }

      return {
        abi: relativePositionManagerAbi,
        address: relativePositionManagerContractAddress,
        functionName: 'closeWithLoss',
        args: [
          longVTokenAddress,
          shortVTokenAddress,
          closeFractionBps,
          repaySwapQuote.fromTokenAmountSoldMantissa,
          repaySwapQuote.minimumToTokenAmountReceivedMantissa,
          repaySwapQuote.minimumToTokenAmountReceivedMantissa,
          repaySwapQuote.callData,
          lossSwapQuote?.fromTokenAmountSoldMantissa ?? 0n,
          minAmountOutSecond,
          lossSwapQuote?.callData ?? '0x',
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
