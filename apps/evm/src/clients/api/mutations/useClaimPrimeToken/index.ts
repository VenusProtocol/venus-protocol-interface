import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { primeAbi, useGetPrimeContractAddress } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';

type Options = UseSendTransactionOptions<void>;

export const useClaimPrimeToken = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const primeContractAddress = useGetPrimeContractAddress();

  return useSendTransaction({
    fn: () => {
      if (!primeContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: primeAbi,
        address: primeContractAddress,
        functionName: 'claim',
        args: [],
      };
    },
    onConfirmed: async () => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_PRIME_TOKEN, { accountAddress, chainId }],
      });
    },
    options,
  });
};
