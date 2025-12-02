import type { Account, Address, Chain, Hex, WriteContractParameters } from 'viem';

import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { leverageManagerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ExactInSwapQuote, VToken } from 'types';

type OpenLeveragedPositionWithSwapInput = {
  swapQuote: ExactInSwapQuote;
  borrowedVToken: VToken;
  suppliedVToken: VToken;
};

type OpenLeveragedPositionWithSingleAssetInput = {
  vToken: VToken;
  amountMantissa: bigint;
};

type OpenLeveragedPositionInput =
  | OpenLeveragedPositionWithSwapInput
  | OpenLeveragedPositionWithSingleAssetInput;

type Options = UseSendTransactionOptions<OpenLeveragedPositionInput>;

export const useOpenLeveragedPosition = (options?: Partial<Options>) => {
  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  return useSendTransaction({
    fn: (input: OpenLeveragedPositionInput) => {
      if (!leverageManagerContractAddress) {
        throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
      }

      if ('swapQuote' in input) {
        return {
          abi: leverageManagerAbi,
          address: leverageManagerContractAddress,
          functionName: 'enterLeverage',
          args: [
            input.suppliedVToken.address,
            0n,
            input.borrowedVToken.address,
            input.swapQuote.fromTokenAmountSoldMantissa,
            input.swapQuote.minimumToTokenAmountReceivedMantissa,
            input.swapQuote.callData,
          ],
        } as WriteContractParameters<
          typeof leverageManagerAbi,
          'enterLeverage',
          readonly [Address, bigint, Address, bigint, bigint, Hex],
          Chain,
          Account
        >;
      }

      return {
        abi: leverageManagerAbi,
        address: leverageManagerContractAddress,
        functionName: 'enterSingleAssetLeverage',
        args: [input.vToken.address, 0n, input.amountMantissa],
      } as WriteContractParameters<
        typeof leverageManagerAbi,
        'enterSingleAssetLeverage',
        readonly [Address, bigint, bigint],
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
