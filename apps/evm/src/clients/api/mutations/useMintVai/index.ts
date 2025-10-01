import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { vaiControllerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';

type MintVaiInput = {
  amountMantissa: BigNumber;
};

type Options = UseSendTransactionOptions<MintVaiInput>;

export const useMintVai = (options?: Partial<Options>) => {
  const { address: vaiControllerContractAddress } = useGetContractAddress({
    name: 'VaiController',
  });

  return useSendTransaction({
    fn: ({ amountMantissa }: MintVaiInput) => {
      if (!vaiControllerContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: vaiControllerAbi,
        address: vaiControllerContractAddress,
        functionName: 'mintVAI',
        args: [BigInt(amountMantissa.toFixed())],
      };
    },
    onConfirmed: () => {
      // Invalidate queries related to fetching the user minted VAI amount
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });
    },
    options,
  });
};
