import type BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { relativePositionManagerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ApproximateOutSwapQuote, ExactInSwapQuote } from 'types';

export type CloseTradePositionWithProfitInput = {
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  repaySwapQuote?: ApproximateOutSwapQuote;
  profitSwapQuote?: ExactInSwapQuote;
  profitAmountMantissa?: BigNumber;
};

type Options = UseSendTransactionOptions<CloseTradePositionWithProfitInput>;

export const useCloseTradePositionWithProfit = (options?: Partial<Options>) => {
  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  return useSendTransaction({
    fn: ({
      longVTokenAddress,
      shortVTokenAddress,
      repaySwapQuote,
      profitSwapQuote,
      profitAmountMantissa,
    }: CloseTradePositionWithProfitInput) => {
      if (!relativePositionManagerContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      let longAmountToRedeemForProfit = profitSwapQuote?.fromTokenAmountSoldMantissa;

      if (longAmountToRedeemForProfit === undefined) {
        longAmountToRedeemForProfit = profitAmountMantissa
          ? BigInt(profitAmountMantissa.toFixed())
          : 0n;
      }

      return {
        abi: relativePositionManagerAbi,
        address: relativePositionManagerContractAddress,
        functionName: 'closeWithProfitAndDeactivate',
        args: [
          longVTokenAddress,
          shortVTokenAddress,
          {
            longAmountToRedeemForRepay: repaySwapQuote?.fromTokenAmountSoldMantissa ?? 0n,
            minAmountOutRepay: repaySwapQuote?.minimumToTokenAmountReceivedMantissa ?? 0n,
            swapDataRepay: repaySwapQuote?.callData ?? '0x',
            longAmountToRedeemForProfit,
            minAmountOutProfit: profitSwapQuote?.minimumToTokenAmountReceivedMantissa ?? 0n,
            swapDataProfit: profitSwapQuote?.callData ?? '0x',
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
