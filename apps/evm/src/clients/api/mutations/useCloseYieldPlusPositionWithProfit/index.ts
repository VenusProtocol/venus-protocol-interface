import type { Address } from 'viem';

import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { relativePositionManagerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ApproximateOutSwapQuote, ExactInSwapQuote } from 'types';

export type CloseYieldPlusPositionWithProfitInput = {
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  repaySwapQuote?: ApproximateOutSwapQuote;
  profitSwapQuote: ExactInSwapQuote;
};

type Options = UseSendTransactionOptions<CloseYieldPlusPositionWithProfitInput>;

export const useCloseYieldPlusPositionWithProfit = (options?: Partial<Options>) => {
  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  return useSendTransaction({
    fn: ({
      longVTokenAddress,
      shortVTokenAddress,
      repaySwapQuote,
      profitSwapQuote,
    }: CloseYieldPlusPositionWithProfitInput) => {
      if (!relativePositionManagerContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: relativePositionManagerAbi,
        address: relativePositionManagerContractAddress,
        functionName: 'closeWithProfitAndDeactivate',
        args: [
          longVTokenAddress,
          shortVTokenAddress,
          {
            longAmountToRedeemForRepay: repaySwapQuote
              ? repaySwapQuote.fromTokenAmountSoldMantissa
              : 0n,
            minAmountOutRepay: repaySwapQuote
              ? repaySwapQuote.minimumToTokenAmountReceivedMantissa
              : 0n,
            swapDataRepay: repaySwapQuote ? repaySwapQuote.callData : '0x',
            longAmountToRedeemForProfit: profitSwapQuote.fromTokenAmountSoldMantissa,
            minAmountOutProfit: profitSwapQuote.minimumToTokenAmountReceivedMantissa,
            swapDataProfit: profitSwapQuote.callData,
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
