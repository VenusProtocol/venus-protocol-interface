import { useGetPrimeContract } from 'packages/contracts';
import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { ClaimPrimeTokenOutput, claimPrimeToken, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<ClaimPrimeTokenOutput, Error>;

const useClaimPrimeToken = (options?: Options) => {
  const primeContract = useGetPrimeContract({ passSigner: true });

  return useMutation(
    FunctionKey.CLAIM_PRIME_TOKEN,
    () =>
      callOrThrow({ primeContract }, params =>
        claimPrimeToken({
          ...params,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await primeContract?.signer.getAddress();
        queryClient.invalidateQueries([FunctionKey.GET_PRIME_TOKEN, { accountAddress }]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimPrimeToken;
