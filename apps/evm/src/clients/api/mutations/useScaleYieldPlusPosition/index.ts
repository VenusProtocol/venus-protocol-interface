import type { Address } from 'viem';

import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { relativePositionManagerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { SwapQuote } from 'types';

export type ScaleYieldPlusPositionInput = {
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  additionalPrincipalMantissa: bigint;
  shortAmountMantissa: bigint;
  minLongAmountMantissa: bigint;
  swapQuote: SwapQuote;
};

type Options = UseSendTransactionOptions<ScaleYieldPlusPositionInput>;

export const useScaleYieldPlusPosition = (options?: Partial<Options>) => {
  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  return useSendTransaction({
    fn: ({
      longVTokenAddress,
      shortVTokenAddress,
      additionalPrincipalMantissa,
      shortAmountMantissa,
      minLongAmountMantissa,
      swapQuote,
    }: ScaleYieldPlusPositionInput) => {
      if (!relativePositionManagerContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: relativePositionManagerAbi,
        address: relativePositionManagerContractAddress,
        functionName: 'scalePosition',
        args: [
          longVTokenAddress,
          shortVTokenAddress,
          additionalPrincipalMantissa,
          shortAmountMantissa,
          minLongAmountMantissa,
          swapQuote.callData,
        ],
      } as const;
    },
    onConfirmed: () => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_YIELD_PLUS_POSITIONS],
      });
    },
    options,
  });
};
