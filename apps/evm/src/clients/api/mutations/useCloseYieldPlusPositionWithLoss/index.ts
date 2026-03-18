import type { Address } from 'viem';

import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { relativePositionManagerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ApproximateOutSwapQuote, ExactInSwapQuote } from 'types';

export type CloseYieldPlusPositionWithLossInput = {
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  repaySwapQuote: ExactInSwapQuote;
  lossSwapQuote: ApproximateOutSwapQuote;
};

type Options = UseSendTransactionOptions<CloseYieldPlusPositionWithLossInput>;

export const useCloseYieldPlusPositionWithLoss = (options?: Partial<Options>) => {
  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  return useSendTransaction({
    fn: ({
      longVTokenAddress,
      shortVTokenAddress,
      repaySwapQuote,
      lossSwapQuote,
    }: CloseYieldPlusPositionWithLossInput) => {
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
            dsaAmountToRedeemForSecondSwap: lossSwapQuote.fromTokenAmountSoldMantissa,
            minAmountOutSecond: lossSwapQuote.minimumToTokenAmountReceivedMantissa,
            swapDataSecond: lossSwapQuote.callData,
          },
        ],
      } as const;
    },
    onConfirmed: () => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_RAW_YIELD_PLUS_POSITIONS],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_ACCOUNT_TRANSACTION_HISTORY],
      });
    },
    options,
  });
};
