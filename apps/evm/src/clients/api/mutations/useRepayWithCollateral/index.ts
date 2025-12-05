import type { Account, Address, Chain, Hex, WriteContractParameters } from 'viem';

import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { leverageManagerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { SwapQuote, VToken } from 'types';

type RepayWithCollateralWithSwapInput = {
  swapQuote: SwapQuote;
  collateralVToken: VToken;
  repaidVToken: VToken;
};

type RepayWithCollateralWithSingleAssetInput = {
  vToken: VToken;
  amountMantissa: bigint;
};

type RepayWithCollateralInput =
  | RepayWithCollateralWithSwapInput
  | RepayWithCollateralWithSingleAssetInput;

type Options = UseSendTransactionOptions<RepayWithCollateralInput>;

export const useRepayWithCollateral = (options?: Partial<Options>) => {
  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  return useSendTransaction({
    fn: (input: RepayWithCollateralInput) => {
      if (!leverageManagerContractAddress) {
        throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
      }

      if ('swapQuote' in input) {
        const collateralAmountMantissa =
          input.swapQuote.direction === 'exact-in' ||
          input.swapQuote.direction === 'approximate-out'
            ? input.swapQuote.fromTokenAmountSoldMantissa
            : input.swapQuote.maximumFromTokenAmountSoldMantissa;

        const repaidAmountMantissa =
          input.swapQuote.direction === 'exact-in' ||
          input.swapQuote.direction === 'approximate-out'
            ? input.swapQuote.minimumToTokenAmountReceivedMantissa
            : input.swapQuote.toTokenAmountReceivedMantissa;

        return {
          abi: leverageManagerAbi,
          address: leverageManagerContractAddress,
          functionName: 'exitLeverage',
          args: [
            input.collateralVToken.address,
            collateralAmountMantissa,
            input.repaidVToken.address,
            repaidAmountMantissa, // borrowedAmountToFlashLoan
            repaidAmountMantissa, // minAmountOutAfterSwap: this needs to correspond to
            // borrowedAmountToFlashLoan + swap fee (which is currently 0%, hence why it is
            // currently equal to borrowedAmountToFlashLoan)
            input.swapQuote.callData,
          ],
        } as WriteContractParameters<
          typeof leverageManagerAbi,
          'exitLeverage',
          readonly [Address, bigint, Address, bigint, bigint, Hex],
          Chain,
          Account
        >;
      }

      return {
        abi: leverageManagerAbi,
        address: leverageManagerContractAddress,
        functionName: 'exitSingleAssetLeverage',
        args: [input.vToken.address, input.amountMantissa],
      } as WriteContractParameters<
        typeof leverageManagerAbi,
        'exitSingleAssetLeverage',
        readonly [Address, bigint],
        Chain,
        Account
      >;
    },
    onConfirmed: () => {
      // TODO: send analytic event

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });
    },
    options,
  });
};
