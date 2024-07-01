import { queryClient, withdrawXvs } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetXvsVestingContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type Options = UseSendTransactionOptions<void>;

const useWithdrawXvs = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const xvsVestingContract = useGetXvsVestingContract({
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: [FunctionKey.WITHDRAW_XVS],
    fn: () => callOrThrow({ xvsVestingContract }, withdrawXvs),
    onConfirmed: async () => {
      const accountAddress = await xvsVestingContract?.signer.getAddress();

      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT] });

      // Invalidate cached Prime data
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_PRIME_STATUS,
          {
            chainId,
            accountAddress,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_PRIME_TOKEN,
          {
            chainId,
            accountAddress,
          },
        ],
      });
    },
    options,
  });
};

export default useWithdrawXvs;
