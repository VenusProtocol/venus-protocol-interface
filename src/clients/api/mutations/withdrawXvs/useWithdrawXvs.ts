import { queryClient, withdrawXvs } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetXvsVestingContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { callOrThrow } from 'utilities';

type Options = UseSendTransactionOptions<void>;

const useWithdrawXvs = (options?: Options) => {
  const { chainId } = useChainId();
  const xvsVestingContract = useGetXvsVestingContract({
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: FunctionKey.WITHDRAW_XVS,
    fn: () => callOrThrow({ xvsVestingContract }, withdrawXvs),
    onConfirmed: async () => {
      const accountAddress = await xvsVestingContract?.signer.getAddress();

      queryClient.invalidateQueries(FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT);

      // Invalidate cached Prime data
      queryClient.invalidateQueries([
        FunctionKey.GET_PRIME_STATUS,
        {
          chainId,
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_PRIME_TOKEN,
        {
          chainId,
          accountAddress,
        },
      ]);
    },
    options,
  });
};

export default useWithdrawXvs;
