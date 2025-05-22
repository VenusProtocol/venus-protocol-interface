import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { vaiControllerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress, useChainId } from 'libs/wallet';

type RepayVaiInput = {
  amountMantissa: BigNumber;
};

type Options = UseSendTransactionOptions<RepayVaiInput>;

export const useRepayVai = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { address: vaiControllerContractAddress } = useGetContractAddress({
    name: 'VaiController',
  });
  const vai = useGetToken({
    symbol: 'VAI',
  });

  return useSendTransaction({
    fn: ({ amountMantissa }: RepayVaiInput) => {
      if (!vaiControllerContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: vaiControllerAbi,
        address: vaiControllerContractAddress,
        functionName: 'repayVAI',
        args: [BigInt(amountMantissa.toFixed())],
      };
    },
    onConfirmed: async () => {
      // Invalidate queries related to fetching the user minted VAI amount
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_USER_VAI_BORROW_BALANCE],
      });

      if (vai) {
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_TOKEN_ALLOWANCE,
            {
              chainId,
              tokenAddress: vai.address,
              accountAddress,
              spenderAddress: vaiControllerContractAddress,
            },
          ],
        });
      }
    },
    options,
  });
};
