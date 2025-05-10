import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import MAX_UINT256 from 'constants/maxUint256';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { erc20Abi } from 'libs/contracts';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Address } from 'viem';

type ApproveTokenInput = {
  tokenAddress: Address;
  spenderAddress: Address;
  allowanceMantissa?: BigNumber;
};
type Options = UseSendTransactionOptions<ApproveTokenInput>;

export const useApproveToken = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  return useSendTransaction({
    fn: (input: ApproveTokenInput) => ({
      abi: erc20Abi,
      address: input.tokenAddress,
      functionName: 'approve',
      args: [input.spenderAddress, BigInt((input.allowanceMantissa || MAX_UINT256).toFixed())],
    }),
    onConfirmed: async ({ input }) => {
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input?.tokenAddress,
            spenderAddress: input?.spenderAddress,
            accountAddress,
          },
        ],
      });
    },
    options,
  });
};
