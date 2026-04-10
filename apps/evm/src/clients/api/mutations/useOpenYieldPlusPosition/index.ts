import BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import { queryClient } from 'clients/api/queryClient';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { relativePositionManagerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ExactInSwapQuote } from 'types';

export type OpenYieldPlusPositionInput = {
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  dsaIndex: number;
  initialPrincipalMantissa: bigint;
  leverageFactor: number;
  swapQuote: ExactInSwapQuote;
};

type Options = UseSendTransactionOptions<OpenYieldPlusPositionInput>;

export const useOpenYieldPlusPosition = (options?: Partial<Options>) => {
  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  return useSendTransaction({
    fn: ({
      longVTokenAddress,
      shortVTokenAddress,
      dsaIndex,
      initialPrincipalMantissa,
      leverageFactor,
      swapQuote,
    }: OpenYieldPlusPositionInput) => {
      if (!relativePositionManagerContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: relativePositionManagerAbi,
        address: relativePositionManagerContractAddress,
        functionName: 'activateAndOpenPosition',
        args: [
          longVTokenAddress,
          shortVTokenAddress,
          dsaIndex,
          initialPrincipalMantissa,
          BigInt(new BigNumber(leverageFactor).multipliedBy(COMPOUND_MANTISSA).toFixed(0)),
          swapQuote.fromTokenAmountSoldMantissa,
          swapQuote.minimumToTokenAmountReceivedMantissa,
          swapQuote.callData,
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
