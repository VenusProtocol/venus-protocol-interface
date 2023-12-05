import { claimPrimeToken, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetPrimeContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { callOrThrow } from 'utilities';

type Options = UseSendTransactionOptions<void>;

const useClaimPrimeToken = (options?: Options) => {
  const { chainId } = useChainId();
  const primeContract = useGetPrimeContract({ passSigner: true });

  return useSendTransaction({
    fnKey: FunctionKey.CLAIM_PRIME_TOKEN,
    fn: () => callOrThrow({ primeContract }, claimPrimeToken),
    onConfirmed: async () => {
      const accountAddress = await primeContract?.signer.getAddress();
      queryClient.invalidateQueries([FunctionKey.GET_PRIME_TOKEN, { accountAddress, chainId }]);
    },
    options,
  });
};

export default useClaimPrimeToken;
