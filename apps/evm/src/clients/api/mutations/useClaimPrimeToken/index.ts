import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { primeAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';

type Options = UseSendTransactionOptions<void>;

export const useClaimPrimeToken = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { address: primeContractAddress } = useGetContractAddress({
    name: 'Prime',
  });

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
